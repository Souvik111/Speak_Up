import Link from "next/link";
import { Mic, ArrowRight } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center max-w-2xl w-full text-center mt-12 space-y-8">
      <div className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-indigo-600 uppercase">Today's Topic</h2>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          {topicDisplay}
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto pt-2">
          Take 60 seconds to speak your mind. We'll analyze your hesitations and give you one specific thing to improve tomorrow.
        </p>
      </div>

      <div className="pt-8 w-full flex justify-center">
        <Link 
          href={`/record?topic=${encodeURIComponent(topicDisplay)}${topicId ? `&topicId=${topicId}` : ''}`} 
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:-translate-y-0.5"
        >
          <Mic className="w-5 h-5" />
          <span>Start Speaking</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="pt-16 pb-8 border-t border-gray-200 w-full mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-600">
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-900 mb-1">1. Read</span>
            <span>Understand the topic</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-900 mb-1">2. Speak</span>
            <span>Record for 60 seconds</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-900 mb-1">3. Improve</span>
            <span>Get actionable feedback</span>
          </div>
        </div>
      </div>
    </div>
  );
}
