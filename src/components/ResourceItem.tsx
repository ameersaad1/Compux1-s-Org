import React from 'react';
import { useApp } from "../store";
import type { Resource } from "../types";

export function ResourceItem({ resource: r }: { resource: Resource; key?: React.Key }) {
  const { incrementDownload, showToast, lang } = useApp();
  const icons: Record<string, string> = { pdf: "📄", doc: "📝", ppt: "📊", xlsx: "📈" };
  const colors: Record<string, string> = { pdf: "#f43f5e", doc: "#3b82f6", ppt: "#f59e0b", xlsx: "#22c55e" };

  function handleDownload() {
    incrementDownload(r.id);
    showToast(
      lang === "ar"
        ? `جارٍ تنزيل ملف "${r.title}"...`
        : `Downloading "${r.title}"...`
    );
  }

  return (
    <div
      className="glass rounded-2xl p-4 flex items-center gap-4 card-hover"
      style={{
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-xs"
        style={{ background: (colors[r.fileType] || "#6d5ef5") + "18" }}
      >
        {icons[r.fileType] || "📄"}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-xs sm:text-sm font-bold truncate"
          style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
        >
          {r.title}
        </p>
        <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}>
          {r.subject} · {r.uploadedAt}
        </p>
        <p className="text-[11px] mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>
          {r.downloads} {lang === "ar" ? "تنزيل" : "downloads"}
        </p>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        className="shrink-0 flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 shadow-xs"
        style={{
          background: "var(--primary)",
          color: "#fff",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        ⬇ {lang === "ar" ? "تحميل" : "Download"}
      </button>
    </div>
  );
}
