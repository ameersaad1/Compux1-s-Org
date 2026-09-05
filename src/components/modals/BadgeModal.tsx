import React from 'react';
import { useApp } from "../../store";
import type { Badge } from "../../types";

export function BadgeModal({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  const { lang } = useApp();
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl relative"
        style={{ border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
          style={{ background: badge.color + "22", border: "2px solid " + badge.color + "44" }}
        >
          {badge.emoji}
        </div>
        <h2
          className="text-xl font-extrabold mb-2"
          style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
        >
          {lang === "ar" ? badge.nameAr : badge.name}
        </h2>
        <p
          className="text-sm mb-4 leading-relaxed"
          style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}
        >
          {lang === "ar" ? badge.descAr : badge.desc}
        </p>
        <p className="text-xs font-mono font-medium" style={{ color: badge.color }}>
          {lang === "ar" ? `تم الحصول عليها: ${badge.earnedAt}` : `Earned: ${badge.earnedAt}`}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 active:scale-98"
          style={{ background: "var(--muted)", color: "var(--foreground)", fontFamily: "'Outfit', sans-serif" }}
        >
          {lang === "ar" ? "إغلاق" : "Close"}
        </button>
      </div>
    </div>
  );
}
