import React, { useState, useEffect } from 'react';
import { useApp } from "../store";
import { Av, VerBadge, SkeletonCard, EmptyState, CompuxLogo } from "../components/primitives";
import { PostCard, HashtagChip } from "../components/PostCard";
import { SearchModal } from "../components/modals/SearchModal";
import type { Post } from "../types";

export function FeedView() {
  const {
    posts,
    setPosts,
    currentUser,
    users,
    events,
    groups,
    setView,
    setViewUserId,
    setActiveHashtag,
    notifications,
    t,
    lang,
    setLang,
    dark,
    setDark,
    setCurrentUser,
    followUser,
    isFollowing,
    showToast,
  } = useApp();

  const [filter, setFilter] = useState<"all" | "following" | "trending">("all");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  const dir = lang === "ar" ? "rtl" : "ltr";
  const unreadAlerts = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setNewImage(url);
  }

  function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!newContent.trim() || !currentUser) return;

    const extractedTags = (newContent.match(/#\w+/g) || []).map((t) => t.slice(1));
    const newPost: Post = {
      id: Date.now(),
      authorId: currentUser.id,
      content: newContent.trim(),
      image: newImage || undefined,
      tag: newTag.trim() || undefined,
      tagColor: "#6d5ef5",
      hashtags: extractedTags,
      likes: 0,
      shares: 0,
      comments: [],
      time: lang === "ar" ? "الآن" : "Just now",
      createdAt: new Date().toISOString(),
      pinned: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewContent("");
    setNewTag("");
    setNewImage(null);
    showToast(lang === "ar" ? "تم نشر المنشور بنجاح! 🚀" : "Published successfully! 🚀");
  }

  const filteredPosts = posts.filter((p) => {
    if (filter === "following") {
      return currentUser?.following.includes(p.authorId) || p.authorId === currentUser?.id;
    }
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (filter === "trending") return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const suggestedUsers = users
    .filter((u) => u.id !== currentUser?.id && !currentUser?.following.includes(u.id))
    .slice(0, 4);

  const allTags: string[] = Array.from<string>(new Set(posts.flatMap((p) => p.hashtags))).slice(0, 6);

  return (
    <div className="gradient-mesh min-h-screen" dir={dir}>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}

      {/* Top Mobile / Tablet Header */}
      <header
        className="lg:hidden glass-nav sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <CompuxLogo size={32} />
          <span className="font-extrabold text-base gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {t.appName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center glass border shadow-xs"
            style={{ borderColor: "var(--border)" }}
            aria-label="Search"
          >
            🔍
          </button>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm glass border shadow-xs"
            style={{ borderColor: "var(--border)" }}
          >
            {dark ? "☀️" : "🌙"}
          </button>
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="text-xs px-2.5 py-1 rounded-full font-bold glass border shadow-xs"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            {lang === "en" ? "ع" : "EN"}
          </button>
        </div>
      </header>

      {/* Main 3-column Layout */}
      <div
        className="max-w-7xl mx-auto px-3 sm:px-4 py-6 flex gap-6"
        style={{ paddingBottom: 90 }}
      >
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 w-64 shrink-0 sticky top-6 h-[calc(100vh-48px)] overflow-y-auto scrollbar-none">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="glow rounded-xl p-2" style={{ background: "var(--secondary)" }}>
              <CompuxLogo size={32} />
            </div>
            <div>
              <span className="font-extrabold text-lg gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {t.appName}
              </span>
              <p className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                CAMPUS V2.6
              </p>
            </div>
          </div>

          {/* User Quick Profile Card */}
          {currentUser && (
            <div
              className="glass rounded-2xl p-4 shadow-sm border card-hover cursor-pointer"
              style={{ borderColor: "var(--border)" }}
              onClick={() => {
                setViewUserId(currentUser.id);
                setView("profile");
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Av src={currentUser.avatar} name={currentUser.name} size={44} online />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs sm:text-sm truncate" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                      {currentUser.name}
                    </span>
                    {currentUser.isVerified && <VerBadge color={currentUser.verificationColor} size={12} />}
                  </div>
                  <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>
                    @{currentUser.handle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t text-center" style={{ borderColor: "var(--border)" }}>
                <div>
                  <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                    {currentUser.postCount}
                  </span>
                  <p className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                    {t.posts}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                    {currentUser.followers.length}
                  </span>
                  <p className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                    {t.followers}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-500">
                    {currentUser.isAdmin ? "∞" : currentUser.studyHours + "h"}
                  </span>
                  <p className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                    {t.studyHours}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Primary Navigation Links */}
          <nav className="glass rounded-2xl p-2.5 shadow-sm border flex flex-col gap-1" style={{ borderColor: "var(--border)" }}>
            {[
              { id: "feed", label: t.feed, icon: "🏠" },
              { id: "explore", label: t.explore, icon: "🧭" },
              { id: "groups", label: t.studyGroupsLabel, icon: "👥" },
              { id: "study", label: t.studyHub, icon: "⏱" },
              { id: "events", label: t.events, icon: "📅" },
              { id: "messages", label: t.messages, icon: "💬" },
              { id: "alerts", label: t.alerts, icon: "🔔", badge: unreadAlerts },
              { id: "settings", label: t.settings, icon: "⚙️" },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => setView(link.id as any)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-98"
                style={{
                  color: link.id === "feed" ? "var(--primary)" : "var(--foreground)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <span className="text-base">{link.icon}</span>
                <span className="flex-1 text-start">{link.label}</span>
                {link.badge ? (
                  <span className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center text-white text-[10px] font-bold">
                    {link.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          {/* Global Switches & Logout */}
          <div className="glass rounded-2xl p-3 shadow-sm border flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="text-xs px-3 py-1.5 rounded-xl font-bold glass border hover:opacity-80 transition-opacity"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              {lang === "en" ? "العربية" : "English"}
            </button>
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm glass border hover:opacity-80 transition-opacity"
              style={{ borderColor: "var(--border)" }}
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentUser(null);
                setView("feed");
              }}
              className="text-xs px-3 py-1.5 rounded-xl font-bold hover:opacity-80 transition-opacity"
              style={{ color: "#f43f5e", background: "#f43f5e15" }}
            >
              🚪 {t.logout}
            </button>
          </div>
        </aside>

        {/* Center Main Feed */}
        <main className="flex-1 min-w-0 max-w-2xl mx-auto flex flex-col gap-4">
          {/* Post Creation Box */}
          {currentUser && (
            <div
              className="glass rounded-3xl p-4 sm:p-5 shadow-sm border transition-all"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex gap-3 items-start">
                <Av src={currentUser.avatar} name={currentUser.name} size={42} online />
                <div className="flex-1 min-w-0">
                  <textarea
                    rows={3}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={t.shareAcademic}
                    className="w-full bg-transparent resize-none text-xs sm:text-sm outline-none leading-relaxed"
                    style={{ color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
                  />

                  {newImage && (
                    <div className="relative rounded-2xl overflow-hidden mb-3 border max-h-48" style={{ borderColor: "var(--border)" }}>
                      <img src={newImage} alt="Upload preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewImage(null)}
                        className="absolute top-2 end-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center text-xs font-bold hover:bg-black"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t flex-wrap gap-2" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-medium cursor-pointer glass border hover:opacity-80 transition-opacity" style={{ borderColor: "var(--border)" }}>
                        <span>🖼</span>
                        <span className="hidden sm:inline">{lang === "ar" ? "صورة" : "Image"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>

                      <input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder={lang === "ar" ? "تصنيف (اختياري)" : "Tag"}
                        className="text-xs px-2.5 py-1.5 rounded-xl border outline-none max-w-[120px]"
                        style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!newContent.trim()}
                      onClick={handlePublish}
                      className="gradient-bg glow text-white text-xs sm:text-sm font-bold px-5 py-2 rounded-xl shadow-md disabled:opacity-50 active:scale-95 transition-all"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {t.publish} 🚀
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feed Filter Tabs */}
          <div className="flex gap-1.5 p-1 rounded-2xl glass border shadow-2xs" style={{ borderColor: "var(--border)" }}>
            {[
              { id: "all", label: t.allPosts, icon: "🌐" },
              { id: "following", label: t.followingFeed, icon: "👥" },
              { id: "trending", label: t.trending, icon: "🔥" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id as typeof filter)}
                className="flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98"
                style={{
                  background: filter === f.id ? "var(--primary)" : "transparent",
                  color: filter === f.id ? "#fff" : "var(--muted-foreground)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="flex flex-col gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : sortedPosts.length === 0 ? (
            <EmptyState
              emoji="🎓"
              title={lang === "ar" ? "لا توجد منشورات في هذه الخلاصة" : "No posts found"}
              sub={lang === "ar" ? "كن أول من يشارك نشاطه الأكاديمي مع زملائه اليوم!" : "Be the first to share an academic highlight!"}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {sortedPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:flex flex-col gap-4 w-72 shrink-0 sticky top-6 h-[calc(100vh-48px)] overflow-y-auto scrollbar-none">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="glass rounded-2xl px-4 py-3 shadow-sm border flex items-center justify-between text-xs text-neutral-400 hover:opacity-80 active:scale-98 transition-all"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <span>🔍</span>
              <span>{t.searchPlaceholder}</span>
            </div>
            <kbd className="text-[10px] px-2 py-0.5 rounded font-mono border" style={{ borderColor: "var(--border)" }}>
              ⌘K
            </kbd>
          </button>

          {/* Upcoming Campus Events */}
          <div className="glass rounded-2xl p-4 shadow-sm border" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                {t.upcomingEvents}
              </h3>
              <button
                type="button"
                onClick={() => setView("events")}
                className="text-[11px] font-semibold text-purple-600 hover:underline"
              >
                {lang === "ar" ? "الكل" : "All"} →
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                  onClick={() => setView("events")}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: ev.color + "22" }}
                  >
                    {ev.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: "var(--foreground)", fontFamily: "'Outfit', sans-serif" }}>
                      {ev.title}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>
                      📅 {ev.date} · 📍 {ev.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Hashtags */}
          <div className="glass rounded-2xl p-4 shadow-sm border" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
              {t.trendingHashtags}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <HashtagChip key={tag} tag={tag} />
              ))}
            </div>
          </div>

          {/* Suggested Peers */}
          <div className="glass rounded-2xl p-4 shadow-sm border" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
              {lang === "ar" ? "زملاء قد تعرفهم" : "Suggested Peers"}
            </h3>
            <div className="flex flex-col gap-2.5">
              {suggestedUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setViewUserId(u.id);
                      setView("profile");
                    }}
                  >
                    <Av src={u.avatar} name={u.name} size={34} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>
                        {u.name}
                      </span>
                      {u.isVerified && <VerBadge color={u.verificationColor} size={10} />}
                    </div>
                    <p className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>
                      @{u.handle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => followUser(u.id)}
                    className="text-[11px] px-2.5 py-1 rounded-full font-bold transition-all active:scale-95 shrink-0"
                    style={{
                      background: isFollowing(u.id) ? "var(--muted)" : "var(--primary)",
                      color: isFollowing(u.id) ? "var(--muted-foreground)" : "#fff",
                    }}
                  >
                    {isFollowing(u.id) ? "✓" : "+"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Footer Notes */}
          <footer className="px-2 text-[11px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            <p>© 2026 Compux Campus Network. نظام متكامل للتعليم الجامعي الذكي.</p>
          </footer>
        </aside>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-nav border-t px-2 py-2 flex items-center justify-around"
        style={{ borderColor: "var(--border)" }}
      >
        {[
          { id: "feed", icon: "🏠", label: t.feed },
          { id: "explore", icon: "🧭", label: t.explore },
          { id: "study", icon: "⏱", label: t.studyHub },
          { id: "messages", icon: "💬", label: t.messages },
          { id: "alerts", icon: "🔔", label: t.alerts, badge: unreadAlerts },
          { id: "profile", icon: "👤", label: t.profile },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === "profile" && currentUser) {
                setViewUserId(currentUser.id);
              }
              setView(item.id as any);
            }}
            className="flex flex-col items-center gap-0.5 relative py-1 px-2.5 rounded-xl transition-all active:scale-95"
            style={{ color: "var(--foreground)" }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {item.label}
            </span>
            {item.badge ? (
              <span className="absolute top-0 end-1 w-4 h-4 rounded-full gradient-bg flex items-center justify-center text-white text-[9px] font-bold">
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>
    </div>
  );
}
