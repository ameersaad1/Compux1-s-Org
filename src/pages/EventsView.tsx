import React from 'react';
import { useApp } from "../store";
import { EmptyState } from "../components/primitives";
import { HashtagChip } from "../components/PostCard";

export function EventsView() {
  const { events, setEvents, currentUser, t, lang, setView, showToast } = useApp();
  const dir = lang === "ar" ? "rtl" : "ltr";

  function toggleAttend(id: number) {
    if (!currentUser) return;
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== id) return ev;
        const going = ev.attending.includes(currentUser.id);
        const updated = going
          ? ev.attending.filter((x) => x !== currentUser.id)
          : [...ev.attending, currentUser.id];

        showToast(
          going
            ? (lang === "ar" ? "تم إلغاء تسجيل الحضور" : "RSVP cancelled")
            : (lang === "ar" ? "تم تأكيد حضورك في الفعالية! 🎉" : "RSVP confirmed! 🎉")
        );
        return { ...ev, attending: updated };
      })
    );
  }

  return (
    <div className="gradient-mesh min-h-screen" dir={dir}>
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "24px 16px 100px" }}>
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setView("feed")}
            className="text-xs font-bold hover:opacity-75"
            style={{ color: "var(--muted-foreground)", fontFamily: "'Outfit', sans-serif" }}
          >
            {t.backToFeed}
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {t.events}
          </h1>
        </div>

        {events.length === 0 ? (
          <EmptyState emoji="📅" title="لا توجد فعاليات مجدولة حالياً" />
        ) : (
          events.map((ev) => {
            const going = currentUser && ev.attending.includes(currentUser.id);
            return (
              <div
                key={ev.id}
                className="glass rounded-2xl p-5 mb-4 card-hover shadow-xs"
                style={{ border: "1px solid var(--border)" }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div
                    className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs"
                    style={{ background: ev.color + "22" }}
                  >
                    {ev.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className="text-[11px] font-bold uppercase tracking-wide"
                          style={{ color: ev.color, fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {ev.category}
                        </span>
                        <h3 className="font-bold text-base mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                          {ev.title}
                        </h3>
                        <p className="text-xs sm:text-sm mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}>
                          {ev.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAttend(ev.id)}
                        className="text-xs sm:text-sm px-4 py-2 rounded-full font-bold shrink-0 active:scale-95 transition-all shadow-xs"
                        style={{
                          background: going ? ev.color : ev.color + "18",
                          color: going ? "#fff" : ev.color,
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        {going ? t.going : t.rsvp}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <span>📅 {ev.date}</span>
                      <span>🕐 {ev.time}</span>
                      <span>📍 {ev.location}</span>
                      <span className="font-bold" style={{ color: ev.color }}>
                        {ev.attending.length} {t.attending}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {ev.hashtags.map((tag) => (
                        <HashtagChip key={tag} tag={tag} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
