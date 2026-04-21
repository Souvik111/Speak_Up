import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const dgKey = process.env.DEEPGRAM_API_KEY;
    if (!dgKey) {
      return NextResponse.json({ error: "DEEPGRAM_API_KEY is missing." }, { status: 500 });
    }

    // 1. Process via Deepgram
    const dgResponse = await fetch("https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&filler_words=true", {
      method: "POST",
      headers: {
        Authorization: `Token ${dgKey}`,
        "Content-Type": audioFile.type || 'audio/webm',
      },
      body: await audioFile.arrayBuffer()
    });

    if (!dgResponse.ok) {
      const err = await dgResponse.text();
      console.error("Deepgram Error:", err);
      throw new Error(`Deepgram API failed: ${err}`);
    }

    const dgData = await dgResponse.json();
    const result = dgData?.results?.channels?.[0]?.alternatives?.[0];
    
    if (!result) {
      throw new Error("No transcription result received.");
    }

    const transcript = result.transcript;
    const words = result.words || [];

    // 2. Metrics Calculation
    let fillerCount = 0;
    let pauseCount = 0;
    
    for (let i = 0; i < words.length; i++) {
      // Check for common filler words (Deepgram tags some with filler prop, or we can check literally)
      if (words[i].punctuated_word?.toLowerCase().match(/^(um|uh|like|you know|hmm)$/)) {
        fillerCount++;
      }
      
      // Check pause between this word and previous
      if (i > 0) {
        const gap = words[i].start - words[i-1].end;
        if (gap > 1.0) pauseCount++; // pause longer than 1 second
      }
    }

    // Audio duration is approximately the last word's end time
    const durationMins = words.length > 0 ? (words[words.length - 1].end / 60) : 1; 
    const wpm = words.length > 0 ? Math.round(words.length / durationMins) : 0;
    
    // Simple Score algorithm
    let score = 100 - (fillerCount * 2) - (pauseCount * 5);
    if (wpm < 100) score -= ((100 - wpm) / 2); // Penalize slow speaking slightly
    if (score < 0) score = 0;
    if (score > 100) score = 100;
    score = Math.floor(score);
    
    // 3. OpenRouter Analysis
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    
    let mistake = "Mock Mistake: We noticed a few hesitations in your speech flow.";
    let improvement = "Mock Improvement: Continue practicing. Add OpenRouter API key for real AI coach feedback.";

    if (transcript.trim().length === 0) {
      mistake = "We couldn't hear any words.";
      improvement = "Make sure your microphone is working and you speak clearly.";
      score = 0;
    } else if (openRouterKey) {
      const prompt = `You are an expert English speaking coach.
Analyze this short speech:
Transcript: "${transcript}"
Metrics: WPM: ${wpm}, Fillers: ${fillerCount}, Long Pauses: ${pauseCount}.

Respond EXACTLY with a JSON object holding 'mistake' (1 sentence identifying the main hesitation/filler/grammar error) and 'improvement' (1 actionable specific advice for tomorrow). No markdown, just raw JSON.`;

      const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini", // Cost effective for analysis
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (orResponse.ok) {
        const orData = await orResponse.json();
        try {
          const aiContent = JSON.parse(orData.choices[0].message.content);
          if (aiContent.mistake) mistake = aiContent.mistake;
          if (aiContent.improvement) improvement = aiContent.improvement;
        } catch (e) {
          console.error("Failed to parse OpenRouter JSON", e);
        }
      }
    }

    // 4. Return Output
    return NextResponse.json({
      score,
      wpm,
      pauses: pauseCount,
      fillers: fillerCount,
      mistake,
      improvement,
      transcript
    });

  } catch (error) {
    console.error("Audio processing error:", error);
    return NextResponse.json({ error: error.message || "Failed to process audio" }, { status: 500 });
  }
}
