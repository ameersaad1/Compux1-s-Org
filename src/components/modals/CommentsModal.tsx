import React, { useState, useRef, useEffect } from 'react';
import { useApp } from "../../store";
import { Av, VerBadge, EmptyState } from "../primitives";
import type { Post, Comment } from "../../types";

export function CommentsModal({ post, onClose }: { post: Post; onClose: () => void }) {
  const { getUserById, currentUser, setPosts, lang, addComment: storeAddComment } = useApp();
  const [localComments, setLocalComments] = useState<Comment[]>(post.comments);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function addComment() {
    if (!text.trim() || !currentUser) return;
    const commentContent = text.trim();
    const c: Comment = {
      id: Date.now(),
      authorId: currentUser.id,
      text: commentContent,
      time: lang === "ar" ? "الآن" : "Just now",
      likes: 0,
      replies: []
    };
    const next = [c, ...localComments];
    setLocalComments(next);
    setText("");
    storeAddComment(post.id, commentContent);
  }

  function addReply(commentId: number) {
    if (!replyText.trim() || !currentUser) return;
    const replyContent = replyText.trim();
    const reply: Comment = {
      id: Date.now(),
      authorId: currentUser.id,
      text: replyContent,
      time: lang === "ar" ? "الآن" : "Just now",
      likes: 0,
      replies: []
    };
    const next = localComments.map((c) =>
      c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c
    );
    setLocalComments(next);
    setReplyText("");
    setReplyTo(null);
    storeAddComment(post.id, replyContent, commentId);
  }

  function toggleCommentLike(commentId: number) {
    setLikedComments((prev) => {
      const n = new Set(prev);
      if (n.has(commentId)) n.delete(commentId);
      else n.add(commentId);
      return n;
    });
  }

  function CommentItem({ c, nested = false }: { c: Comment; nested?: boolean; key?: React.Key }) {
    const author = getUserById(c.authorId);
    const liked = likedComments.has(c.id);
    return (
      <div className={`flex gap-2.5 ${nested ? (lang === "ar" ? "mr-8 mt-2" : "ml-8 mt-2") : "mb-3"}`}>
        {author && <Av src={author.avatar} name={author.name} size={nested ? 26 : 32} />}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl px-3 py-2.5 shadow-xs" style={{ background: "var(--muted)" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-bold" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                {author?.name}
              </span>
              {author?.isVerified && <VerBadge color={author.verificationColor} size={11} />}
              <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                · {c.time}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--card-foreground)", fontFamily: "'Inter', sans-serif" }}>
              {c.text}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-1 px-1">
            <button
              type="button"
              onClick={() => toggleCommentLike(c.id)}
              className="flex items-center gap-1 text-xs transition-all hover:opacity-80"
              style={{ color: liked ? "#f43f5e" : "var(--muted-foreground)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {c.likes + (liked ? 1 : 0)}
            </button>
            {!nested && (
              <button
                type="button"
                onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                className="text-xs font-semibold hover:underline"
                style={{ color: "var(--primary)", fontFamily: "'Outfit', sans-serif" }}
              >
                {lang === "ar" ? "رد" : "Reply"}
              </button>
            )}
          </div>
          {replyTo === c.id && !nested && (
            <div className="flex gap-2 mt-2">
              {currentUser && <Av src={currentUser.avatar} name={currentUser.name} size={24} />}
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addReply(c.id)}
                placeholder={lang === "ar" ? `الرد على ${author?.name}...` : `Reply to ${author?.name}...`}
                className="flex-1 px-3 py-1.5 rounded-xl text-xs outline-none"
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontFamily: "'Inter', sans-serif",
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => addReply(c.id)}
                className="gradient-bg text-white text-xs px-3 py-1.5 rounded-xl font-semibold shrink-0"
              >
                ↵
              </button>
            </div>
          )}
          {c.replies?.map((r) => (
            <CommentItem key={r.id} c={r} nested />
          ))}
        </div>
      </div>
    );
  }

  const author = getUserById(post.authorId);

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        style={{ border: "1px solid var(--border)", maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            {author && <Av src={author.avatar} name={author.name} size={32} />}
            <div>
              <p className="text-xs font-bold" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                {author?.name}
              </p>
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                {localComments.length} {lang === "ar" ? "تعليقات" : "comments"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-75 transition-opacity"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            ✕
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 max-h-[60vh]">
          {localComments.length === 0 ? (
            <EmptyState
              emoji="💬"
              title={lang === "ar" ? "لا توجد تعليقات بعد" : "No comments yet"}
              sub={lang === "ar" ? "كن أول من يشارك برأيه!" : "Be the first to comment!"}
            />
          ) : (
            localComments.map((c) => <CommentItem key={c.id} c={c} />)
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 px-4 py-3 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          {currentUser && <Av src={currentUser.avatar} name={currentUser.name} size={32} />}
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
            placeholder={lang === "ar" ? "أضف تعليقك الأكاديمي..." : "Add a comment..."}
            className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
            style={{
              background: "var(--muted)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button
            type="button"
            onClick={addComment}
            className="gradient-bg glow text-white px-4 py-2 rounded-xl font-semibold text-xs shrink-0 active:scale-95 transition-all"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {lang === "ar" ? "إرسال" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
