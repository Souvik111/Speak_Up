import Link from 'next/link';
import { Mic } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full h-[60px] border-b border-gray-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Mic className="w-5 h-5 text-indigo-600" />
        <Link href="/" className="font-bold text-lg tracking-tight text-gray-900">
          Speak Up
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
          🔥 Streak: 0
        </div>
        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Log in
        </Link>
      </div>
    </nav>
  );
}
