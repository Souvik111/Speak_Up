import Link from 'next/link';
import { Mic } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="relative z-50 w-full h-[64px] border-b flex items-center justify-between px-6"
         style={{
           background: 'rgba(10, 10, 15, 0.6)',
           backdropFilter: 'blur(20px)',
           WebkitBackdropFilter: 'blur(20px)',
           borderColor: 'rgba(255, 255, 255, 0.06)',
         }}>
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Mic className="w-5 h-5 text-violet-400" />
          <div className="absolute inset-0 w-5 h-5 rounded-full animate-pulse-glow" style={{ filter: 'blur(6px)' }}></div>
        </div>
        <Link href="/" className="font-bold text-lg tracking-tight gradient-text">
          Speak Up
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full"
             style={{
               background: 'rgba(245, 158, 11, 0.1)',
               border: '1px solid rgba(245, 158, 11, 0.2)',
               color: '#f59e0b',
             }}>
          <span>🔥</span>
          <span>Streak: 0</span>
        </div>
        <Link href="/login" className="ghost-button text-sm font-medium px-4 py-1.5">
          Log in
        </Link>
      </div>
    </nav>
  );
}
