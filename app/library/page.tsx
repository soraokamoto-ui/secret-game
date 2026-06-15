"use client";

import { useState, useEffect } from "react";
import { fetchCards } from "@/lib/sheets";
import Card from "@/components/Card";
import Link from "next/link";
import { CardData } from "@/types/card";

const ACCESS_KEY = "sgd_access";

const WEEKS = [
  { key: "week1", label: "VIP Lounge",       stage: "Stage 1" },
  { key: "week2", label: "Private Dining",   stage: "Stage 1" },
  { key: "week3", label: "Grand Suite",      stage: "Stage 2" },
  { key: "week4", label: "Casino of Ego",    stage: "Stage 2" },
  { key: "week5", label: "Midnight Theater", stage: "Stage 3" },
  { key: "week6", label: "Galaxy Express",   stage: "Stage 3" },
];

function getUnlockedLevels(): number[] {
  try {
    const raw = localStorage.getItem(ACCESS_KEY);
    return raw ? JSON.parse(raw) : [12];
  } catch {
    return [12];
  }
}

function getVisibleCount(unlockedLevels: number[]): number {
  if (unlockedLevels.includes(36)) return 36;
  if (unlockedLevels.includes(24)) return 24;
  return 12;
}

export default function LibraryPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    fetchCards().then((c) => {
      setCards(c);
      setLoading(false);
    });
    const unlocked = getUnlockedLevels();
    setVisibleCount(getVisibleCount(unlocked));
  }, []);

  const allCards = cards.slice(0, 36);
  const unlockedCards = cards.slice(0, visibleCount);
  const lockedCards = allCards.slice(visibleCount);

  const weeks = WEEKS.map((week, wi) => {
    const start = wi * 6;
    const end = start + 6;
    const weekUnlocked = unlockedCards.slice(start, end);
    const weekLocked = lockedCards.filter((_, li) => {
      const globalIndex = visibleCount + li;
      return globalIndex >= start && globalIndex < end;
    });
    return { ...week, unlocked: weekUnlocked, locked: weekLocked };
  }).filter((w) => w.unlocked.length > 0 || w.locked.length > 0);

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{ background: "linear-gradient(160deg, #EDE8E0 0%, #E0D8CC 100%)" }}
    >
      {/* ヘッダー */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-xs tracking-widest hover:opacity-50 transition-opacity"
            style={{ color: "#8B7355" }}
          >
            ← HOME
          </Link>
          <p className="text-xs tracking-[0.4em]" style={{ color: "#C9A96E" }}>
            CARD LIBRARY
          </p>
          <div className="w-16" />
        </div>
        <div className="text-center">
          <h1
            className="text-4xl font-light mb-2"
            style={{ color: "#2C2420", fontFamily: "Cormorant Garamond, serif" }}
          >
            All Cards
          </h1>
          <p className="text-sm" style={{ color: "#8B7355" }}>
            {visibleCount} / {allCards.length} cards unlocked
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-sm tracking-widest" style={{ color: "#8B7355" }}>
            Loading...
          </p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-16">
          {weeks.map((week) => {
            const totalSlots = 6;
            const unlockedCount = week.unlocked.length;
            const lockedCount = Math.min(week.locked.length, totalSlots - unlockedCount);

            return (
              <div key={week.key}>
                {/* weekヘッダー */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px" style={{ background: "#C9A96E33" }} />
                  <div className="text-center px-2">
                    <p className="text-xs tracking-widest mb-1" style={{ color: "#C9A96E" }}>
                      {week.stage}
                    </p>
                    <p
                      className="text-xl font-light"
                      style={{ color: "#2C2420", fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.05em" }}
                    >
                      {week.label}
                    </p>
                  </div>
                  <div className="flex-1 h-px" style={{ background: "#C9A96E33" }} />
                </div>

                {/* 6枚グリッド */}
                <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
                  {week.unlocked.map((card) => (
                    <div key={card.id} className="flex justify-center">
                      <Card card={card} popupMode={true} />
                    </div>
                  ))}
                  {Array.from({ length: lockedCount }).map((_, li) => (
                    <div key={`locked-${week.key}-${li}`} className="flex justify-center">
                      <div
                        className="relative rounded-2xl overflow-hidden w-full"
                        style={{
                          aspectRatio: "2/3",
                          maxWidth: 160,
                          background: "linear-gradient(135deg, #E8DDD0, #C9A96E22)",
                          border: "1px solid #C9A96E22",
                        }}
                      >
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                          style={{ background: "#F5F0E844" }}
                        >
                          <span style={{ color: "#C9A96E44", fontSize: 20 }}>✦</span>
                          <p
                            className="text-xs tracking-widest"
                            style={{ color: "#C9A96E44", fontFamily: "Cormorant Garamond, serif" }}
                          >
                            LOCKED
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* 次のステージへの導線：36枚解放済みの場合は表示しない */}
          {visibleCount < 36 && (
            <div className="text-center py-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px" style={{ background: "#C9A96E22" }} />
                <p className="text-xs tracking-widest" style={{ color: "#C9A96E55" }}>
                  ✦ &nbsp; MORE AWAITS &nbsp; ✦
                </p>
                <div className="flex-1 h-px" style={{ background: "#C9A96E22" }} />
              </div>
              <Link
                href="/"
                className="inline-block px-8 py-3 rounded-full text-xs tracking-widest transition-all hover:opacity-70"
                style={{ border: "1px solid #C9A96E55", color: "#8B7355" }}
              >
                次のステージを解放する →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}