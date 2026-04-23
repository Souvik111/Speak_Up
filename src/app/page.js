import Link from "next/link";
import { Mic, ArrowRight, BookOpen, MessageSquare, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function Home() {
  let topicDisplay = "Convince me why tea is better than coffee.";
  let topicId = null;

  // Fetch dynamic topic from Supabase if connected
  if (supabase) {
    const { data: topics, error } = await supabase.from('topics').select('id, prompt');
    if (!error && topics && topics.length > 0) {
      // Select a random topic for the daily exercise in MVP
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      topicDisplay = randomTopic.prompt;
      topicId = randomTopic.id;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl w-full text-center mt-8 sm:mt-12">
      {/* Topic Section */}
      <div className="animate-fade-in-up space-y-5">
        <span className="gradient-pill inline-block px-4 py-1.5">
          Today&apos;s Topic
        </span>
        <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight gradient-text">
          {topicDisplay}
        </h1>
        <p className="text-base max-w-lg mx-auto pt-1" style={{ color: 'var(--text-secondary)' }}>
          Take 60 seconds to speak your mind. We&apos;ll analyze your hesitations and give you one specific thing to improve tomorrow.
        </p>
      </div>

      {/* CTA Button */}
      <div className="pt-10 w-full flex justify-center animate-fade-in-up-delay-1">
        <Link 
          href={`/record?topic=${encodeURIComponent(topicDisplay)}${topicId ? `&topicId=${topicId}` : ''}`} 
          className="glow-button inline-flex items-center justify-center gap-2.5 px-10 py-4 text-lg font-semibold"
        >
          <Mic className="w-5 h-5" />
          <span>Start Speaking</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* How it works – 3 Glass Cards */}
      <div className="pt-20 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card-sm p-6 flex flex-col items-center text-center animate-fade-in-up-delay-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                 style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <BookOpen className="w-5 h-5 text-violet-400" />
            </div>
            <span className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>1. Read</span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Understand the topic</span>
          </div>
          <div className="glass-card-sm p-6 flex flex-col items-center text-center animate-fade-in-up-delay-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                 style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <MessageSquare className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>2. Speak</span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Record for 60 seconds</span>
          </div>
          <div className="glass-card-sm p-6 flex flex-col items-center text-center animate-fade-in-up-delay-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                 style={{ background: 'rgba(34, 211, 238, 0.12)', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>3. Improve</span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Get actionable feedback</span>
          </div>
        </div>
      </div>
    </div>
  );
}
