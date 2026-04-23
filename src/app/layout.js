import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: "Speak Up – Daily English Speaking Confidence Trainer",
  description: "One task per day. One improvement at a time. Build real speaking confidence with AI-powered feedback.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`} suppressHydrationWarning>
        {/* Animated mesh gradient background */}
        <div className="mesh-bg" aria-hidden="true">
          <div className="mesh-blob mesh-blob-1"></div>
          <div className="mesh-blob mesh-blob-2"></div>
          <div className="mesh-blob mesh-blob-3"></div>
        </div>

        <Navbar />
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-8 pb-16 px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
