"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Mic } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto pt-12 sm:pt-16">
      <div className="w-full glass-card p-8 sm:p-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mic className="w-6 h-6 text-violet-400" />
            <span className="text-xl font-bold gradient-text">Speak Up</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Sign in
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Get your daily speaking topic and AI feedback.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dark-input w-full px-4 py-3"
              placeholder="you@example.com"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="glow-button w-full flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Magic Link</span>}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-xl text-center text-sm font-medium whitespace-pre-wrap"
               style={{
                 background: 'var(--surface)',
                 border: '1px solid var(--glass-border)',
                 color: 'var(--text-secondary)',
               }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
