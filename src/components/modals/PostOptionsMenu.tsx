import React, { useState, useRef, useEffect } from 'react';
import { useApp } from "../../store";
import type { Post } from "../../types";

export function PostOptionsMenu({ post, onClose }: { post: Post; onClose: () => void }) {
  const { deletePost, currentUser, showToast, setPosts, addReport, lang } = useApp();
  const isOwner = currentUser?.isAdmin || currentUser?.id === post.authorId;
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.content);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  function handleCopyLink() {
    navigator.clipboard.writeText(`https://compux.edu/post/${post.id}`).then(() => {
      showToast(lang === "ar" ? "تم نسخ الرابط! 🔗" : "Link copied! 🔗");
      onClose();
    });
  }

  function handleSaveEdit() {
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, content: editText } : p))
    );
    showToast(lang === "ar" ? "تم تحديث المنشور!" : "Post updated!");
    onClose();
  }

  if (editing) {
    return (
      <div
        ref={menuRef}
        className="absolute right-0 top-8 z-50 glass rounded-2xl p-3 w-72 shadow-2xl border"
        style={{ borderColor: "var(--border)" }}
      >
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={4}
          className="w-full text-xs outline-none resize-none rounded-xl p-3 mb-2"
          style={{
            background: "var(--muted)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            fontFamily: "'Inter', sans-serif",
          }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={handleSaveEdit}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold gradient-bg text-white hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {lang === "ar" ? "حفظ" : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-8 z-50 glass rounded-2xl py-1 w-48 shadow-2xl border"
      style={{ borderColor: "var(--border)" }}
    >
      <button
        type="button"
        onClick={handleCopyLink}
        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-start transition-all hover:opacity-75"
        style={{ color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
      >
        🔗 {lang === "ar" ? "نسخ الرابط" : "Copy Link"}
      </button>

      {isOwner && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-start transition-all hover:opacity-75"
          style={{ color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
        >
          ✏️ {lang === "ar" ? "تعديل المنشور" : "Edit Post"}
        </button>
      )}

      {isOwner && (
        <button
          type="button"
          onClick={() => {
            deletePost(post.id);
            onClose();
          }}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-start transition-all hover:opacity-75"
          style={{ color: "#f43f5e", fontFamily: "'Inter', sans-serif" }}
        >
          🗑 {lang === "ar" ? "حذف المنشور" : "Delete Post"}
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          addReport(post.id, "Reported by user");
          onClose();
        }}
        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-start transition-all hover:opacity-75"
        style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}
      >
        🚩 {lang === "ar" ? "إبلاغ عن محتوى" : "Report"}
      </button>
    </div>
  );
}
