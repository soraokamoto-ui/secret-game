"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Card, { playCardSelect } from "@/components/Card";
import { CardData } from "@/types/card";

const HISTORY_KEY = "sgd_history";
const ACCESS_KEY = "sgd_access";

const ACCESS_CODES: Record<number, string | null> = {
  12: null,
  24: "28419",
  36: "73652",
};

const levelLabels: Record<number, string> = {
  12: "Stage 1",
  24: "Stage 2",
  36: "Stage 3",
};

const deckNames: Record<number, string> = {
  12: "VIP Access",
  24: "Royal Access",
  36: "The World Access",
};

const CARD_BG = "linear-gradient(135deg, #5C3D3D 0%, #7A4F4F 50%, #6B4545 100%)";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getUnlockedLevels(): number[] {
  if (typeof window === "undefined") return [12];
  try {
    const raw = localStorage.getItem(ACCESS_KEY);
    return raw ? JSON.parse(raw) : [12];
  } catch {
    return [12];
  }
}

function unlockLevel(level: number) {
  const current = getUnlockedLevels();
  if (!current.includes(level)) {
    localStorage.setItem(ACCESS_KEY, JSON.stringify([...current, level]));
  }
}

function CardPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 120 180" fill="none">
      <rect x="6" y="6" width="108" height="168" stroke="#C9A96E" strokeWidth="0.6" />
      <rect x="12" y="12" width="96" height="156" stroke="#C9A96E" strokeWidth="0.3" />
      <line x1="6" y1="6" x2="114" y2="174" stroke="#C9A96E" strokeWidth="0.3" />
      <line x1="114" y1="6" x2="6" y2="174" stroke="#C9A96E" strokeWidth="0.3" />
      <circle cx="60" cy="90" r="30" stroke="#C9A96E" strokeWidth="0.5" />
      <circle cx="60" cy="90" r="20" stroke="#C9A96E" strokeWidth="0.3" />
      <polygon points="60,60 86,105 34,105" stroke="#C9A96E" strokeWidth="0.4" fill="none" />
      <polygon points="60,120 34,75 86,75" stroke="#C9A96E" strokeWidth="0.4" fill="none" />
    </svg>
  );
}

// ============================================================
// ACCESS GATE
// ============================================================
function AccessGate({
  level,
  cards,
  onUnlock,
}: {
  level: number;
  cards: CardData[];
  onUnlock: () => void;
}) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    if (code === ACCESS_CODES[level]) {
      setStatus("success");
      unlockLevel(level);
      setTimeout(() => onUnlock(), 1800);
    } else {
      setStatus("error");
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setStatus("idle");
        setCode("");
      }, 1200);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCode(val);
  }

  const previewCards = cards.slice(0, 6);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center px-6 py-12 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #EDE8E0 0%, #E0D8CC 100%)" }}
    >
      <div
        className="absolute inset-0 flex flex-wrap justify-center gap-4 p-8 pointer-events-none"
        style={{ filter: "blur(6px)", opacity: 0.5, transform: "scale(1.05)" }}
      >
        {previewCards.map((card) => (
          <div
            key={card.id}
            className="rounded-2xl overflow-hidden flex-shrink-0"
            style={{ width: 120, height: 180, border: "1px solid #C9A96E55", background: CARD_BG }}
          >
            {card.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>

      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #EDE8E0cc, #2C242066)" }} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8">
        <div className="text-center">
          <p className="text-xs tracking-[0.5em] mb-1" style={{ color: "#C9A96E" }}>
            {levelLabels[level]}
          </p>
          <h2 className="text-4xl font-light mb-3" style={{ color: "#2C2420", fontFamily: "Cormorant Garamond, serif" }}>
            {deckNames[level]}
          </h2>
          <p className="text-sm" style={{ color: "#8B7355", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
            このデッキへのアクセスには
            <br />
            ACCESS CODEが必要です
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-2"
            >
              <p className="text-3xl font-light tracking-[0.3em]" style={{ color: "#C9A96E", fontFamily: "Cormorant Garamond, serif" }}>
                ACCESS GRANTED
              </p>
              <p className="text-xs tracking-widest" style={{ color: "#8B7355" }}>
                ✦ &nbsp; UNLOCKING &nbsp; ✦
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <input
                ref={inputRef}
                type="tel"
                value={code}
                onChange={handleChange}
                placeholder="ACCESS CODE"
                maxLength={5}
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]*"
                className="text-center tracking-[0.3em] outline-none w-56 py-3 px-4 rounded-xl"
                style={{
                  background: "#F5F0E8",
                  border: `1px solid ${status === "error" ? "#C94A4A" : "#C9A96E88"}`,
                  color: "#2C2420",
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 16,
                }}
              />
              {status === "error" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs tracking-widest" style={{ color: "#C94A4A" }}>
                  INVALID CODE
                </motion.p>
              )}
              <motion.button
                onClick={handleSubmit}
                className="px-10 py-3 rounded-full text-sm tracking-[0.2em]"
                style={{ background: "#2C2420", color: "#C9A96E", fontFamily: "Cormorant Garamond, serif", border: "1px solid #C9A96E44" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                ENTER
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <Link href="/" className="text-xs tracking-widest transition-opacity hover:opacity-50" style={{ color: "#8B7355" }}>
          ← BACK
        </Link>
      </div>
    </div>
  );
}

// ============================================================
// カードスライダー
// ============================================================
function CardSlider({ cards, onSelect }: { cards: CardData[]; onSelect: (card: CardData) => void }) {
  const [shuffled] = useState<CardData[]>(() => {
    const a = [...cards];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });

  const [current, setCurrent] = useState(() => Math.floor(cards.length / 2));
  const touchStartX = useRef<number | null>(null);

  function playSlide() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch { /* ignore */ }
  }

  function prev() { playSlide(); setCurrent((i) => Math.max(0, i - 1)); }
  function next() { playSlide(); setCurrent((i) => Math.min(shuffled.length - 1, i + 1)); }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 40) next();
    else if (diffX < -40) prev();
    touchStartX.current = null;
  }

  const CARD_W = 200;
  const CARD_H = 300;
  const OVERLAP = 24; // 重なり量

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <p
        className="text-sm text-center leading-relaxed px-6"
        style={{ color: "#8B7355", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
      >
        静かに息を吸って、<br />
        心に浮かぶカードを選んでください。
      </p>

      {/* カードデッキ */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ height: CARD_H + 40 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {shuffled.map((card, i) => {
          const diff = i - current;
          const absDiff = Math.abs(diff);
          if (absDiff > 6) return null;

          const isActive = diff === 0;
          // 真横のみオフセット、傾き・縦移動なし
          const offsetX = diff * OVERLAP;
          const zIndex = isActive ? 30 : 20 - absDiff;

          return (
            <motion.div
              key={card.id}
              className="absolute cursor-pointer"
              style={{ width: CARD_W, height: CARD_H, zIndex }}
              animate={{
                x: offsetX,
                y: isActive ? -10 : 0,
                scale: isActive ? 1.04 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => {
                if (isActive) {
                  playCardSelect();
                  onSelect(card);
                } else {
                  setCurrent(i);
                }
              }}
            >
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #5C3D3D 0%, #7A4F4F 50%, #6B4545 100%)",
                  border: `1px solid ${isActive ? "#C9A96E" : "#C9A96E44"}`,
                  boxShadow: isActive
                    ? "0 24px 48px #2C242055"
                    : "0 4px 16px #2C242022",
                }}
              >
                <CardPattern />
                <div className="relative z-10 text-center">
                  {isActive ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-xs tracking-[0.2em]"
                      style={{ color: "#C9A96E", fontFamily: "Cormorant Garamond, serif", lineHeight: 1.8 }}
                    >
                      TAP TO<br />SELECT
                    </motion.p>
                  ) : (
                    <p style={{ color: "#C9A96E22", fontSize: 10 }}>✦</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PCナビゲーション */}
      <div className="hidden md:flex items-center gap-8">
        <button
          onClick={prev}
          disabled={current === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            border: "1px solid #C9A96E55",
            color: "#C9A96E",
            opacity: current === 0 ? 0.25 : 1,
            fontSize: 20,
          }}
        >
          ‹
        </button>
        <p className="text-xs tracking-widest" style={{ color: "#C9A96E55" }}>✦</p>
        <button
          onClick={next}
          disabled={current === shuffled.length - 1}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            border: "1px solid #C9A96E55",
            color: "#C9A96E",
            opacity: current === shuffled.length - 1 ? 0.25 : 1,
            fontSize: 20,
          }}
        >
          ›
        </button>
      </div>

      <p className="md:hidden text-xs tracking-widest" style={{ color: "#C9A96E44" }}>
        swipe to browse
      </p>
    </div>
  );
}
// ============================================================
// メインのデッキページ
// ============================================================
export default function DeckPageClient({ cards, level }: { cards: CardData[]; level: number }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [phase, setPhase] = useState<"select" | "reveal">("select");
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [todayEntry, setTodayEntry] = useState<{ cardId: number; drawnAt: number } | null>(null);

  useEffect(() => {
    const unlockedLevels = getUnlockedLevels();
    const isUnlocked = ACCESS_CODES[level] === null || unlockedLevels.includes(level);
    setUnlocked(isUnlocked);
    setChecked(true);

    if (isUnlocked) {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return;
      try {
        const history: Record<string, { cardId: number; drawnAt: number }> = JSON.parse(raw);
        const entry = history[getTodayKey()];
        if (entry) {
          const found = cards.find((c) => c.id === entry.cardId);
          if (found) {
            setTodayEntry(entry);
            setSelectedCard(found);
            setPhase("reveal");
            setIsNew(false);
          }
        }
      } catch {
        // ignore
      }
    }
  }, [cards, level]);

  function handleSelectCard(card: CardData) {
    const entry = { cardId: card.id, drawnAt: Date.now() };
    const raw = localStorage.getItem(HISTORY_KEY);
    const history: Record<string, { cardId: number; drawnAt: number }> = raw ? JSON.parse(raw) : {};
    history[getTodayKey()] = entry;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    setSelectedCard(card);
    setTodayEntry(entry);
    setIsNew(true);
    setPhase("reveal");
  }

  if (!checked) return null;

  if (!unlocked) {
    return (
      <AccessGate
        level={level}
        cards={cards}
        onUnlock={() => { setUnlocked(true); setPhase("select"); }}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-12"
      style={{ background: "linear-gradient(160deg, #EDE8E0 0%, #E0D8CC 100%)" }}
    >
      <div className="w-full max-w-2xl mb-10 flex items-center justify-between">
        <Link href="/" className="text-xs tracking-widest hover:opacity-50 transition-opacity" style={{ color: "#8B7355" }}>
          ← BACK
        </Link>
        <div className="text-center">
          <p className="text-xs tracking-widest" style={{ color: "#C9A96E" }}>{levelLabels[level]}</p>
          <p className="text-lg font-light" style={{ color: "#2C2420", fontFamily: "Cormorant Garamond, serif" }}>
            {deckNames[level]}
          </p>
        </div>
        <Link href="/library" className="text-xs tracking-widest hover:opacity-50 transition-opacity" style={{ color: "#8B7355" }}>
          LIBRARY
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {phase === "select" ? (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            <CardSlider cards={cards} onSelect={handleSelectCard} />
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            {selectedCard && <Card card={selectedCard} isNew={isNew} />}
            {todayEntry && (
              <p className="text-xs" style={{ color: "#8B7355" }}>
                {new Date(todayEntry.drawnAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} に選びました
              </p>
            )}
            <motion.button
              className="mt-2 px-8 py-3 rounded-full text-xs tracking-widest"
              style={{ background: "transparent", color: "#8B7355", border: "1px solid #8B735555" }}
              onClick={() => { setSelectedCard(null); setPhase("select"); setIsNew(false); }}
              whileHover={{ opacity: 0.6 }}
            >
              もう一度選ぶ
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}