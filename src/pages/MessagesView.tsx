import React, { useState } from 'react';
import { useApp } from "../store";
import { Av, VerBadge, EmptyState } from "../components/primitives";

export function MessagesView() {
  const { dms, users, currentUser, getUserById, sendDM, t, lang, setView } = useApp();
  const [activeDM, setActiveDM] = useState<string | null>(dms[0]?.userId || null);
  const [msgText, setMsgText] = useState("");
  const dir = lang === "ar" ? "rtl" : "ltr";
  const active = dms.find((d) => d.userId === activeDM);
  const activeUser = getUserById(activeDM || "");

  function handleSend() {
    if (!msgText.trim() || !activeDM) return;
    sendDM(activeDM, msgText.trim());
    setMsgText("");
  }

  return (
    <div className="gradient-mesh" style={{ height: "100vh", display: "flex", flexDirection: "column" }} dir={dir}>
      <div
        className="glass-nav h-16 flex items-center gap-3 px-4 sm:px-6 shrink-0 shadow-xs"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <button
          type="button"
          onClick={() => setView("feed")}
          className="text-xs font-bold hover:opacity-75 transition-opacity"
          style={{ color: "var(--muted-foreground)", fontFamily: "'Outfit', sans-serif" }}
        >
          {t.backToFeed}
        </button>
        <h2 className="font-extrabold text-base" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
          {t.dmTitle}
        </h2>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
        {/* User list */}
        <div
          className="flex flex-col py-3 px-2 overflow-y-auto shrink-0 border-e"
          style={{ width: 280, borderColor: "var(--border)" }}
        >
          {users
            .filter((u) => u.id !== currentUser?.id)
            .map((u) => {
              const dm = dms.find((d) => d.userId === u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setActiveDM(u.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-2xl w-full text-start transition-all active:scale-98 mb-1"
                  style={{
                    background:
                      activeDM === u.id
                        ? "linear-gradient(135deg,rgba(109,94,245,0.18),rgba(139,92,246,0.12))"
                        : "transparent",
                  }}
                >
                  <Av src={u.avatar} name={u.name} size={38} online />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-bold truncate" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                        {u.name}
                      </span>
                      {u.isVerified && <VerBadge color={u.verificationColor} size={11} />}
                    </div>
                    <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>
                      {dm?.messages[dm.messages.length - 1]?.text || (lang === "ar" ? "ابدأ المحادثة الآن!" : "Say hi!")}
                    </p>
                  </div>
                  {dm && dm.unread > 0 && (
                    <span className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                      {dm.unread}
                    </span>
                  )}
                </button>
              );
            })}
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white/20 dark:bg-black/20">
          {activeUser ? (
            <>
              <div
                className="flex items-center gap-3 px-5 py-3 shrink-0 glass"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <Av src={activeUser.avatar} name={activeUser.name} size={38} online />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                      {activeUser.name}
                    </span>
                    {activeUser.isVerified && <VerBadge color={activeUser.verificationColor} size={13} />}
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    @{activeUser.handle} · {activeUser.university}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {active?.messages.map((msg, i) => {
                  const isMe = msg.from === currentUser?.id;
                  const sender = getUserById(msg.from);
                  return (
                    <div key={i} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      {sender && <Av src={sender.avatar} name={sender.name} size={28} />}
                      <div
                        className="max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs"
                        style={{
                          background: isMe ? "var(--primary)" : "var(--muted)",
                          color: isMe ? "#fff" : "var(--card-foreground)",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <span className="block text-[10px] mt-1 opacity-70 font-mono text-end">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 p-3.5 glass shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
                <input
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t.typeMessage}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none border"
                  style={{
                    background: "var(--muted)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="gradient-bg glow px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white active:scale-95 shadow-md transition-all"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {t.send}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyState emoji="💬" title={lang === "ar" ? "اختر محادثة لبدء الدردشة" : "Select a conversation"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
