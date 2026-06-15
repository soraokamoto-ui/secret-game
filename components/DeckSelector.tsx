"use client";

import Link from "next/link";

const levels = [
  {
    level: 12,
    stage: "Stage 1",
    label: "VIP Access",
    sub: "12 cards — 目覚めのデッキ",
    desc: "特別な場所への扉が開く、最初の12枚",
  },
  {
    level: 24,
    stage: "Stage 2",
    label: "Royal Access",
    sub: "24 cards — 深化のデッキ",
    desc: "自分で選べる確信を深める24枚",
  },
  {
    level: 36,
    stage: "Stage 3",
    label: "The World Access",
    sub: "36 cards — 完全覚醒のデッキ",
    desc: "すべてを統合する完全版36枚",
  },
];

export default function DeckSelector() {
  return (
    <div className="flex flex-col gap-5 w-full max-w-sm mx-auto">
      {levels.map(({ level, stage, label, sub, desc }) => (
        <Link key={level} href={`/deck/${level}`}>
          <div
            className="group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer"
            style={{
              background: "#F5F0E8",
              border: "1px solid #C9A96E55",
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, #C9A96E0A, #C9A96E22)" }}
            />
            <div className="relative">
              <p
                className="text-xs tracking-[0.3em] mb-1"
                style={{ color: "#C9A96E" }}
              >
                {stage}
              </p>
              <h3
                className="text-2xl font-light mb-1"
                style={{
                  color: "#2C2420",
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                {label}
              </h3>
              <p className="text-xs mb-2" style={{ color: "#8B7355" }}>
                {sub}
              </p>
              <p
                className="text-sm"
                style={{
                  color: "#4A3728",
                  fontFamily: "'Zen Kaku Gothic New', sans-serif",
                }}
              >
                {desc}
              </p>
            </div>
            <div
              className="absolute right-5 top-1/2 -translate-y-1/2 text-lg transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: "#C9A96E" }}
            >
              →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}