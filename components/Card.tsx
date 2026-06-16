"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CardData } from "@/types/card";

// ============================================================
// 効果音ユーティリティ
// ============================================================
function getAudioContext() {
  if (typeof window === "undefined") return null;
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playCardFlip() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

export function playCardSelect() {
  const ctx = getAudioContext();
  if (!ctx) return;
  [0, 0.08, 0.16].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const freqs = [523, 659, 784];
    osc.frequency.setValueAtTime(freqs[i], ctx.currentTime + delay);
    gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.2);
  });
}

function playPopupOpen() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const freqs = [784, 988, 1175];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
    gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.25);
    osc.start(ctx.currentTime + i * 0.06);
    osc.stop(ctx.currentTime + i * 0.06 + 0.25);
  });
}

function playSpinReveal() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const bufferSize = ctx.sampleRate * 0.6;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.015;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(800, ctx.currentTime);
  noiseFilter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.55);
  noiseFilter.Q.value = 3;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0, ctx.currentTime);
  noiseGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
  noiseGain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.6);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.6);
  const chimeFreqs = [1047, 1319, 1568, 2093];
  chimeFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    const startTime = ctx.currentTime + 0.58 + i * 0.04;
    gain.gain.setValueAtTime(0.0, startTime);
    gain.gain.linearRampToValueAtTime(0.07, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
    osc.start(startTime);
    osc.stop(startTime + 0.4);
  });
}

// ============================================================
// 型定義
// ============================================================
interface CardProps {
  card: CardData;
  isNew?: boolean;
  defaultFlipped?: boolean;
  popupMode?: boolean;
}

// ============================================================
// カード画像スピンコンポーネント
// ============================================================
function SpinRevealCard({ imageUrl, name }: { imageUrl: string; name: string }) {
  return (
    <div style={{ width: "100%", aspectRatio: "827/1181", perspective: 800 }}>
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
        initial={{ rotateY: 900 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.7, ease: [0.15, 0.85, 0.35, 1.1] }}
        onAnimationStart={() => playSpinReveal()}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 32px #2C242033",
          }}
        >
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill className="object-contain" unoptimized />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #E8DDD0, #C9A96E22)" }}>
              <span style={{ color: "#C9A96E", fontSize: 64 }}>✦</span>
            </div>
          )}
          <motion.div
            initial={{ opacity: 1, x: "-100%" }}
            animate={{ opacity: 0, x: "150%" }}
            transition={{ duration: 0.45, delay: 0.58, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(105deg, transparent 30%, #ffffff99 50%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 16,
            background: "linear-gradient(135deg, #5C3D3D 0%, #7A4F4F 50%, #6B4545 100%)",
            boxShadow: "0 8px 32px #2C242033",
          }}
        />
      </motion.div>
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function Card({
  card,
  isNew = false,
  defaultFlipped = false,
  popupMode = false,
}: CardProps) {
  const [flipped, setFlipped] = useState(defaultFlipped);
  const [popup, setPopup] = useState(false);

  if (popupMode) {
    return (
      <>
        <div
          className="relative cursor-pointer rounded-2xl overflow-hidden flex-shrink-0"
          style={{ width: 160, height: 240, border: "1px solid #C9A96E55" }}
          onClick={() => { playPopupOpen(); setPopup(true); }}
        >
          {card.imageUrl ? (
            <Image src={card.imageUrl} alt={card.name} fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E8DDD0, #C9A96E22)" }}>
              <span style={{ color: "#C9A96E", fontSize: 40 }}>✦</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2" style={{ background: "linear-gradient(to top, #2C2420ee, transparent)" }}>
            <p className="text-xs font-light truncate" style={{ color: "#F5F0E8", fontFamily: "Cormorant Garamond, serif" }}>
              {card.name}
            </p>
          </div>
        </div>

        {popup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: "#2C242077" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setPopup(false)}
          >
            <motion.div
              className="relative w-full max-w-xs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "#F5F0E8",
                  border: "1px solid #C9A96E88",
                  boxShadow: "0 32px 80px #2C242055, 0 0 0 1px #C9A96E22",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    background: "linear-gradient(160deg, #F5F0E8 0%, #EDE8E0 100%)",
                    padding: "24px 24px 16px",
                  }}
                >
                  <SpinRevealCard imageUrl={card.imageUrl} name={card.name} />
                </div>
                <div className="flex items-center gap-3 px-6">
                  <div className="flex-1 h-px" style={{ background: "#C9A96E33" }} />
                  <span style={{ color: "#C9A96E", fontSize: 8 }}>✦</span>
                  <div className="flex-1 h-px" style={{ background: "#C9A96E33" }} />
                </div>
                <div className="overflow-y-auto px-6 pb-8 pt-4 space-y-4" style={{ maxHeight: 280 }}>
                  <CardInfo card={card} />
                  <Divider />
                  <Section label="Secret Message" text={card.secretMessage} highlight />
                  <Section label="Mission" text={card.mission} />
                  <Section label="Question" text={card.question} italic />
                </div>
              </div>
              <button
                className="absolute -top-4 -right-4 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                style={{
                  background: "#2C2420",
                  color: "#C9A96E",
                  fontSize: 16,
                  border: "1px solid #C9A96E44",
                  boxShadow: "0 4px 12px #2C242044",
                }}
                onClick={() => setPopup(false)}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </>
    );
  }

  // ============================================================
  // 通常デッキモード：iOSのbackface問題をstateで完全回避
  // ============================================================
  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative cursor-pointer rounded-2xl overflow-hidden"
        style={{ width: 280, height: 420 }}
        onClick={() => { playCardFlip(); setFlipped((f) => !f); }}
        role="button"
        aria-label={flipped ? card.name : "カードをめくる"}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
      >
        {/* 裏面 */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{ opacity: flipped ? 0 : 1, rotateY: flipped ? -180 : 0 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{
            background: "linear-gradient(135deg, #5C3D3D 0%, #7A4F4F 50%, #6B4545 100%)",
            border: "1px solid #C9A96E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardBack isNew={isNew} />
        </motion.div>

        {/* 表面 */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          animate={{ opacity: flipped ? 1 : 0, rotateY: flipped ? 0 : 180 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ border: "1px solid #C9A96E" }}
        >
          {card.imageUrl ? (
            <Image src={card.imageUrl} alt={card.name} fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E8DDD0, #C9A96E22)" }}>
              <span style={{ color: "#C9A96E", fontSize: 64 }}>✦</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* カード下テキスト */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full space-y-4"
          style={{ maxWidth: 280 }}
        >
          <CardInfo card={card} />
          <Divider />
          <Section label="Secret Message" text={card.secretMessage} highlight />
          <Section label="Mission" text={card.mission} />
          <Section label="Question" text={card.question} italic />
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// サブコンポーネント
// ============================================================
function CardInfo({ card }: { card: CardData }) {
  return (
    <div className="text-center space-y-1">
      <p className="text-xl font-light" style={{ color: "#2C2420", fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.05em" }}>
        {card.name}
      </p>
      {card.sign && (
        <p className="text-xs leading-relaxed" style={{ color: "#8B7355", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
          {card.sign}
        </p>
      )}
    </div>
  );
}

function CardBack({ isNew }: { isNew: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 280 420" fill="none">
        <rect x="20" y="20" width="240" height="380" stroke="#C9A96E" strokeWidth="0.5" />
        <rect x="32" y="32" width="216" height="356" stroke="#C9A96E" strokeWidth="0.5" />
        <line x1="20" y1="20" x2="260" y2="400" stroke="#C9A96E" strokeWidth="0.3" />
        <line x1="260" y1="20" x2="20" y2="400" stroke="#C9A96E" strokeWidth="0.3" />
        <circle cx="140" cy="210" r="60" stroke="#C9A96E" strokeWidth="0.5" />
        <circle cx="140" cy="210" r="40" stroke="#C9A96E" strokeWidth="0.3" />
        <polygon points="140,150 192,243 88,243" stroke="#C9A96E" strokeWidth="0.5" fill="none" />
        <polygon points="140,270 88,177 192,177" stroke="#C9A96E" strokeWidth="0.5" fill="none" />
      </svg>
      <div className="relative text-center z-10">
        <p className="text-xs tracking-[0.3em] mb-3" style={{ color: "#C9A96E", fontFamily: "Cormorant Garamond, serif" }}>
          SECRET GAME
        </p>
        <p className="text-2xl font-light tracking-[0.15em]" style={{ color: "#F5F0E8", fontFamily: "Cormorant Garamond, serif" }}>
          DECK
        </p>
        {isNew && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full" style={{ background: "#C9A96E", color: "#2C2420" }}>
            NEW
          </span>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-px" style={{ background: "#C9A96E55" }} />
      <span style={{ color: "#C9A96E", fontSize: 8 }}>✦</span>
      <div className="flex-1 h-px" style={{ background: "#C9A96E55" }} />
    </div>
  );
}

function Section({ label, text, highlight, italic }: {
  label: string;
  text: string;
  highlight?: boolean;
  italic?: boolean;
}) {
  if (!text) return null;
  return (
    <div>
      <p className="text-xs tracking-widest mb-1" style={{ color: "#8B7355", fontFamily: "Cormorant Garamond, serif" }}>
        {label}
      </p>
      <p
        className="text-sm leading-relaxed"
        style={{
          color: highlight ? "#2C2420" : "#4A3728",
          fontStyle: italic ? "italic" : "normal",
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
          fontWeight: highlight ? 500 : 400,
        }}
      >
        {text}
      </p>
    </div>
  );
}