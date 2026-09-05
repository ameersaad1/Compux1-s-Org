import React, { useState, useRef, useEffect } from 'react';
import { useApp } from "../../store";
import { Av, VerBadge } from "../primitives";

export function SearchModal({ onClose }: { onClose: () => void }) {
  const { users, posts, t, setView, setViewUserId, setActiveHashtag, currentUser } = useApp();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"people" | "posts" | "hashtags">("people");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.toLowerCase().trim();
  const filteredUsers = q
    ? users.filter(
        (u) =>
          u.id !== currentUser?.id &&
          (u.name.toLowerCase().includes(q) ||
            u.handle.toLowerCase().includes(q) ||
            u.university.toLowerCase().includes(q) ||
            u.major.toLowerCase().includes(q))
      )
    : users.filter((u) => u.id !== currentUser?.id).slice(0, 6);

  const filteredPosts = q
    ? posts.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.hashtags.some((h) => h.toLowerCase().includes(q))
      )
    : [];

  const allTags: string[] = Array.from<string>(new Set(posts.flatMap((p) => p.hashtags)));
  const filteredTags: string[] = q
    ? allTags.filter((h) => h.toLowerCase().includes(q))
    : allTags.slice(0, 10);

  const tagCounts: Record<string, number> = Object.fromEntries(
    allTags.map((h) => [h, posts.filter((p) => p.hashtags.includes(h)).length])
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        style={{ border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-3 p-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: "var(--muted-foreground)", flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
          />
          <button
            type="button"
            onClick={onClose}
            className="text-xs p-1 hover:opacity-75 transition-opacity"
            style={{ color: "var(--muted-foreground)" }}
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1 p-2" style={{ borderBottom: "1px solid var(--border)" }}>
          {(["people", "posts", "hashtags"] as const).map((tb) => (
            <button
              key={tb}
              type="button"
              onClick={() => setTab(tb)}
              className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all"
              style={{
                background: tab === tb ? "var(--primary)" : "transparent",
                color: tab === tb ? "#fff" : "var(--muted-foreground)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {tb === "people"
                ? t.searchPeople
                : tb === "posts"
                ? t.searchPosts
                : t.searchHashtags}
            </button>
          ))}
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {tab === "people" &&
            (filteredUsers.length === 0 ? (
              <p className="text-center text-xs py-5" style={{ color: "var(--muted-foreground)" }}>
                {t.noResults}
              </p>
            ) : (
              filteredUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all hover:opacity-80 text-start"
                  onClick={() => {
                    setViewUserId(u.id);
                    setView("profile");
                    onClose();
                  }}
                >
                  <Av src={u.avatar} name={u.name} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-xs font-semibold truncate"
                        style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
                      >
                        {u.name}
                      </span>
                      {u.isVerified && <VerBadge color={u.verificationColor} size={11} />}
                      {u.isAdmin && (
                        <span
                          className="text-[10px] px-1 py-0.2 rounded font-mono font-bold"
                          style={{ background: "#f59e0b22", color: "#f59e0b" }}
                        >
                          DEV
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>
                      @{u.handle} · {u.university}
                    </p>
                  </div>
                  <span
                    className="text-[11px] shrink-0 font-mono"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {u.followers.length} {t.followers}
                  </span>
                </button>
              ))
            ))}

          {tab === "posts" &&
            (filteredPosts.length === 0 ? (
              <p className="text-center text-xs py-5" style={{ color: "var(--muted-foreground)" }}>
                {q ? t.noResults : "اكتب كلمة للبحث في المنشورات..."}
              </p>
            ) : (
              filteredPosts.slice(0, 5).map((p) => {
                const au = users.find((u) => u.id === p.authorId);
                return (
                  <div
                    key={p.id}
                    className="px-3 py-2.5 rounded-xl mb-1.5 shadow-2xs cursor-pointer hover:opacity-85"
                    style={{ background: "var(--muted)" }}
                    onClick={() => {
                      setView("feed");
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {au && (
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "var(--foreground)", fontFamily: "'Outfit', sans-serif" }}
                        >
                          {au.name}
                        </span>
                      )}
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                        · {p.time}
                      </span>
                    </div>
                    <p
                      className="text-xs line-clamp-2"
                      style={{ color: "var(--card-foreground)", fontFamily: "'Inter', sans-serif" }}
                    >
                      {p.content}
                    </p>
                  </div>
                );
              })
            ))}

          {tab === "hashtags" &&
            (filteredTags.length === 0 ? (
              <p className="text-center text-xs py-5" style={{ color: "var(--muted-foreground)" }}>
                {t.noResults}
              </p>
            ) : (
              filteredTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl transition-all hover:opacity-80"
                  onClick={() => {
                    setActiveHashtag(tag);
                    setView("hashtag");
                    onClose();
                  }}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#7c3aed", fontFamily: "'Outfit', sans-serif" }}
                  >
                    #{tag}
                  </span>
                  <span
                    className="text-[11px] font-mono"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {tagCounts[tag]} {t.postsHashtag}
                  </span>
                </button>
              ))
            ))}
        </div>
      </div>
    </div>
  );
}
