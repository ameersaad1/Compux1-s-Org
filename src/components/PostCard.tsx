import React, { useState, useEffect } from 'react';
import { useApp } from "../store";
import { Av, VerBadge } from "./primitives";
import { LightboxModal } from "./modals/LightboxModal";
import { CommentsModal } from "./modals/CommentsModal";
import { PostOptionsMenu } from "./modals/PostOptionsMenu";
import type { Post } from "../types";

export function RichText({ content }: { content: string }) {
  const { setActiveHashtag, setView } = useApp();
  return (
    <p
      className="mt-2 text-xs sm:text-sm leading-relaxed whitespace-pre-line"
      style={{ color: "var(--card-foreground)", fontFamily: "'Inter', sans-serif" }}
    >
      {content.split(/(#\w+)/g).map((part, i) =>
        part.startsWith("#") ? (
          <button
            key={i}
            type="button"
            className="font-semibold hover:underline px-0.5"
            style={{ color: "#7c3aed" }}
            onClick={() => {
              setActiveHashtag(part.slice(1));
              setView("hashtag");
            }}
          >
            {part}
          </button>
        ) : (
          part
        )
      )}
    </p>
  );
}

export function HashtagChip({ tag }: { tag: string; key?: React.Key }) {
  const { setActiveHashtag, setView } = useApp();
  return (
    <button
      type="button"
      onClick={() => {
        setActiveHashtag(tag);
        setView("hashtag");
      }}
      className="text-xs px-2.5 py-0.5 rounded-full font-medium transition-all hover:opacity-80 active:scale-95"
      style={{
        background: "rgba(124,58,237,0.12)",
        color: "#7c3aed",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      #{tag}
    </button>
  );
}

export function PostCard({ post }: { post: Post; key?: React.Key }) {
  const {
    getUserById,
    currentUser,
    likedPosts,
    toggleLike,
    setView,
    setViewUserId,
    showToast,
    lang,
    activePostModal,
    setActivePostModal
  } = useApp();

  const author = getUserById(post.authorId);
  if (!author) return null;

  const isLiked = currentUser
    ? (post.likedBy?.includes(currentUser.id) ?? likedPosts.has(post.id))
    : likedPosts.has(post.id);

  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Auto-open comments if linked from notification
  useEffect(() => {
    if (activePostModal === post.id) {
      setShowComments(true);
    }
  }, [activePostModal, post.id]);

  const handleBookmark = () => {
    setSaved((prev) => !prev);
    showToast(
      saved
        ? (lang === "ar" ? "تمت إزالة الحفظ" : "Bookmark removed")
        : (lang === "ar" ? "تم حفظ المنشور في المفضلة 🔖" : "Post saved to bookmarks 🔖")
    );
  };

  return (
    <article
      id={`post-${post.id}`}
      className={`glass rounded-2xl p-4 sm:p-5 feed-item-enter card-hover relative transition-all ${
        activePostModal === post.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''
      }`}
      style={{
        border: "1px solid var(--border)",
      }}
    >
      {lightboxSrc && <LightboxModal src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      {showComments && (
        <CommentsModal
          post={post}
          onClose={() => {
            setShowComments(false);
            if (activePostModal === post.id) {
              setActivePostModal(null);
            }
          }}
        />
      )}

      {post.pinned && (
        <div
          className="flex items-center gap-1.5 text-xs mb-3 font-semibold"
          style={{ color: "#f59e0b", fontFamily: "'JetBrains Mono', monospace" }}
        >
          📌 {lang === "ar" ? "منشور مثبت في القمة" : "Pinned Post"}
        </div>
      )}

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => {
            setViewUserId(author.id);
            setView("profile");
          }}
          className="shrink-0"
        >
          <Av src={author.avatar} name={author.name} online={author.id !== "dev"} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                className="font-bold text-xs sm:text-sm hover:underline"
                style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
                onClick={() => {
                  setViewUserId(author.id);
                  setView("profile");
                }}
              >
                {author.name}
              </button>
              {author.isVerified && <VerBadge color={author.verificationColor} size={13} />}
              {author.isAdmin && (
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-md font-mono font-bold"
                  style={{ background: "#f59e0b22", color: "#f59e0b" }}
                >
                  DEV
                </span>
              )}
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                @{author.handle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {post.tag && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: (post.tagColor || "#6d5ef5") + "22",
                    color: post.tagColor || "#6d5ef5",
                  }}
                >
                  {post.tag}
                </span>
              )}
              <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                {post.time}
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowOptions((v) => !v)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-90"
                  style={{ color: "var(--muted-foreground)" }}
                  aria-label="Post options"
                >
                  •••
                </button>
                {showOptions && <PostOptionsMenu post={post} onClose={() => setShowOptions(false)} />}
              </div>
            </div>
          </div>

          <RichText content={post.content} />

          {post.image && (
            <button
              type="button"
              className="mt-3 rounded-xl overflow-hidden w-full block focus:outline-hidden group"
              style={{ maxHeight: 280, background: "var(--muted)" }}
              onClick={() => setLightboxSrc(post.image!)}
            >
              <img
                src={post.image}
                alt="Post illustration"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                loading="lazy"
              />
            </button>
          )}

          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {post.hashtags.map((tag) => (
                <HashtagChip key={tag} tag={tag} />
              ))}
            </div>
          )}

          {/* Action Row */}
          <div
            className="flex items-center gap-5 sm:gap-6 mt-3 pt-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-125"
              style={{ color: isLiked ? "#f43f5e" : "var(--muted-foreground)" }}
              onClick={() => toggleLike(post.id)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {post.likes + (isLiked ? 1 : 0)}
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold transition-all hover:opacity-80"
              style={{ color: "var(--muted-foreground)" }}
              onClick={() => setShowComments(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {post.comments.length}
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold transition-all hover:opacity-75"
              style={{ color: "var(--muted-foreground)" }}
              onClick={() => {
                navigator.clipboard?.writeText(`https://compux.edu/post/${post.id}`);
                showToast(lang === "ar" ? "تم نسخ رابط المشاركة!" : "Post link copied!");
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {post.shares}
            </button>

            <button
              type="button"
              className="ml-auto transition-all active:scale-110"
              style={{ color: saved ? "#6d5ef5" : "var(--muted-foreground)" }}
              onClick={handleBookmark}
              aria-label="Bookmark post"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
