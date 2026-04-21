"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setMessage("Error: Supabase is not connected.\nPlease check your .env.local file.");
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto pt-16">
      <div className="w-full bg-white border border-gray-200 rounded-3xl shadow-sm p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sign in to Speak Up</h1>
          <p className="text-gray-500 text-sm mt-2">Get your daily speaking topic and AI feedback.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Magic Link</span>}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-xl text-center text-sm text-gray-700 font-medium whitespace-pre-wrap">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
