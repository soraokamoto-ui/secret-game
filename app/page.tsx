import DeckSelector from "@/components/DeckSelector";
import Link from "next/link";

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "linear-gradient(160deg, #EDE8E0 0%, #E0D8CC 100%)" }}
    >
      <div className="text-center mb-12">
        <p
          className="text-xs tracking-[0.5em] mb-4"
          style={{ color: "#C9A96E" }}
        >
          ✦ SECRET GAME ✦
        </p>
        <h1
          className="text-5xl font-light mb-4"
          style={{
            color: "#2C2420",
            fontFamily: "Cormorant Garamond, serif",
            letterSpacing: "0.05em",
          }}
        >
          DECK
        </h1>
        <p
          className="text-sm max-w-xs mx-auto leading-relaxed"
          style={{
            color: "#8B7355",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
          }}
        >
          今日、どの世界線を選ぶ？
        </p>
      </div>

      <div className="w-full max-w-sm">
        <DeckSelector />
      </div>

      <div className="mt-12">
        <Link
          href="/library"
          className="text-xs tracking-widest transition-opacity hover:opacity-60"
          style={{ color: "#8B7355" }}
        >
          CARD LIBRARY →
        </Link>
      </div>
    </div>
  );
}