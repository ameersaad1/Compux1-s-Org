import React from 'react';
import { useApp } from "../store";
import { PostCard } from "../components/PostCard";
import { EmptyState } from "../components/primitives";

export function HashtagPage() {
  const { activeHashtag, posts, setView, t, lang } = useApp();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const tagPosts = posts.filter((p) => p.hashtags.includes(activeHashtag));

  return (
    <div className="gradient-mesh min-h-screen" dir={dir}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 100px" }}>
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setView("feed")}
            className="text-xs font-bold hover:opacity-75"
            style={{ color: "var(--muted-foreground)", fontFamily: "'Outfit', sans-serif" }}
          >
            {t.backToFeed}
          </button>
          <div>
            <h1 className="text-xl font-extrabold gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
              #{activeHashtag}
            </h1>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {tagPosts.length} {t.postsHashtag}
            </p>
          </div>
        </div>

        {tagPosts.length === 0 ? (
          <EmptyState emoji="🏷️" title="لا توجد منشورات بهذا الوسم بعد" />
        ) : (
          <div className="flex flex-col gap-4">
            {tagPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
