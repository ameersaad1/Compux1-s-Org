import React from 'react';
import { useApp } from "../store";
import { Av, VerBadge } from "../components/primitives";
import { PostCard, HashtagChip } from "../components/PostCard";

export function ExploreView() {
  const { users, currentUser, posts, events, followUser, isFollowing, setView, setViewUserId, setActiveHashtag, t, lang } = useApp();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const suggestedUsers = users.filter((u) => u.id !== currentUser?.id).slice(0, 5);
  const allTags: string[] = Array.from<string>(new Set(posts.flatMap((p) => p.hashtags)));
  const trendingPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 4);

  return (
    <div className="gradient-mesh min-h-screen" dir={dir}>
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "24px 16px 100px" }}>
        {/* Header */}
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
            {t.explore}
          </h1>
        </div>

        {/* Suggested Peers Carousel / Cards */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3.5" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
            {lang === "ar" ? "زملاء مقترحون من جامعتك" : "Suggested Campus Peers"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {suggestedUsers.map((u) => (
              <div
                key={u.id}
                className="glass rounded-2xl p-4 flex flex-col items-center text-center card-hover shadow-xs border"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setViewUserId(u.id);
                    setView("profile");
                  }}
                  className="mb-2"
                >
                  <Av src={u.avatar} name={u.name} size={50} online />
                </button>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs sm:text-sm truncate" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                    {u.name}
                  </span>
                  {u.isVerified && <VerBadge color={u.verificationColor} size={12} />}
                </div>
                <p className="text-[11px] truncate mb-2" style={{ color: "var(--muted-foreground)" }}>
                  @{u.handle} · {u.major}
                </p>
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => followUser(u.id)}
                    className="w-full text-xs py-1.5 rounded-xl font-bold transition-all active:scale-95 shadow-2xs"
                    style={{
                      background: isFollowing(u.id) ? "var(--muted)" : "var(--primary)",
                      color: isFollowing(u.id) ? "var(--muted-foreground)" : "#fff",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {isFollowing(u.id) ? t.followingBtn : t.followBtn}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trending Hashtags */}
        <div className="glass rounded-2xl p-5 mb-8 shadow-xs border" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
            {t.trendingHashtags}
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setActiveHashtag(tag);
                  setView("hashtag");
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold glass border hover:scale-105 active:scale-95 transition-all"
                style={{ borderColor: "var(--border)", color: "#7c3aed" }}
              >
                <span>#{tag}</span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {posts.filter((p) => p.hashtags.includes(tag)).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Posts */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3.5" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
            {lang === "ar" ? "المنشورات الأكثر تفاعلاً هذا الأسبوع" : "Trending Campus Highlights"}
          </h2>
          <div className="flex flex-col gap-4">
            {trendingPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
