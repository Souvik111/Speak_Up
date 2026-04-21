import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Speak Up – Daily English Speaking Confidence Trainer",
  description: "One task per day. One improvement at a time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-neutral-50 antialiased">
      <body className={`${inter.className} min-h-full flex flex-col text-neutral-900`}>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center pt-8 pb-16 px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
