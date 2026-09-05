import React, { useState } from "react";
import { useApp, ANALYTICS } from "../store";
import { Av, VerBadge, EmptyState } from "../components/primitives";
import type { Report } from "../types";

export function AdminPanel() {
  const {
    users,
    posts,
    reports,
    verifyUser,
    banUser,
    deletePost,
    setView,
    resolveReport,
    t,
    lang,
    resources,
  } = useApp();
  const [tab, setTab] = useState("stats");
  const dir = lang === "ar" ? "rtl" : "ltr";
  const pendingVerify = users.filter((u) => u.verificationPending);
  const pendingReports = reports.filter((r) => r.status === "pending");
  const maxVal = Math.max(...ANALYTICS.dailyUsers);

  const adminTabs = [
    { id: "stats", label: lang === "ar" ? "التحليلات" : "Analytics", icon: "📊" },
    {
      id: "users",
      label: lang === "ar" ? "المستخدمون" : "Users",
      icon: "👥",
      badge: users.filter((u) => u.banned).length || undefined,
    },
    { id: "posts", label: lang === "ar" ? "المنشورات" : "Posts", icon: "📝" },
    {
      id: "reports",
      label: lang === "ar" ? "البلاغات" : "Reports",
      icon: "🚩",
      badge: pendingReports.length || undefined,
    },
    {
      id: "verify",
      label: lang === "ar" ? "طلبات التوثيق" : "Verify",
      icon: "✓",
      badge: pendingVerify.length || undefined,
    },
  ];

  return (
    <div className="gradient-mesh min-h-screen" dir={dir}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px 100px", display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Sidebar */}
        <aside
          className="glass rounded-2xl p-3 shrink-0 shadow-sm"
          style={{ border: "1px solid var(--border)", width: 210, alignSelf: "flex-start", position: "sticky", top: 24 }}
        >
          <div className="flex items-center gap-2 px-2 py-2 mb-3">
            <span className="text-lg">🛠</span>
            <span className="font-bold text-sm gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {lang === "ar" ? "لوحة الإدارة والتحكم" : "Dev Panel"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setView("feed")}
            className="flex items-center gap-2 text-xs w-full px-2 py-1.5 rounded-lg mb-2 hover:opacity-75 font-semibold transition-opacity"
            style={{ color: "var(--muted-foreground)", fontFamily: "'Outfit', sans-serif" }}
          >
            {t.backToFeed}
          </button>
          {adminTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-start mb-1 active:scale-95"
              style={{
                background:
                  tab === item.id
                    ? "linear-gradient(135deg,rgba(109,94,245,0.18),rgba(139,92,246,0.12))"
                    : "transparent",
                color: tab === item.id ? "var(--primary)" : "var(--muted-foreground)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.badge ? (
                <span className="ms-auto w-5 h-5 gradient-bg rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </aside>

        <div className="flex-1" style={{ minWidth: 280 }}>
          {/* Analytics tab */}
          {tab === "stats" && (
            <div className="flex flex-col gap-4">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    label: lang === "ar" ? "إجمالي الطلاب" : "Total Users",
                    value: users.length,
                    icon: "👥",
                    color: "#6d5ef5",
                    sub: `+${Math.round(users.length * 0.12)} هذا الأسبوع`,
                  },
                  {
                    label: lang === "ar" ? "إجمالي المنشورات" : "Total Posts",
                    value: posts.length,
                    icon: "📝",
                    color: "#3b82f6",
                    sub: `${resources.length} مصدر تعليمي منشور`,
                  },
                  {
                    label: lang === "ar" ? "النشطون اليوم" : "Active Today",
                    value: Math.floor(users.length * 0.7),
                    icon: "🟢",
                    color: "#22c55e",
                    sub: "معدل بقاء يومي 70%",
                  },
                  {
                    label: lang === "ar" ? "إجراءات معلقة" : "Pending Actions",
                    value: pendingVerify.length + pendingReports.length,
                    icon: "⏳",
                    color: "#f59e0b",
                    sub: `${pendingVerify.length} توثيق · ${pendingReports.length} بلاغ`,
                  },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-4 card-hover shadow-xs" style={{ border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {s.value}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}>
                      {s.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bar chart — Daily Active Users */}
              <div className="glass rounded-2xl p-5 shadow-xs" style={{ border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {lang === "ar" ? "الطلاب النشطون يومياً — خريف 2026" : "Daily Active Users — Aug/Sep 2026"}
                  </p>
                  <span className="text-xs px-2.5 py-1 rounded-lg font-mono font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                    +{Math.round((ANALYTICS.dailyUsers[ANALYTICS.dailyUsers.length - 1] / ANALYTICS.dailyUsers[0] - 1) * 100)}% نمو
                  </span>
                </div>
                <div className="flex items-end gap-1.5" style={{ height: 120 }}>
                  {ANALYTICS.dailyUsers.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${ANALYTICS.labels[i]}: ${val} users`}>
                      <div
                        className="w-full rounded-t-lg transition-all hover:opacity-80 cursor-default"
                        style={{
                          height: `${(val / maxVal) * 100}%`,
                          background: `linear-gradient(to top, #4f46e5, #a855f7)`,
                          minHeight: 6,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-1 mt-2">
                  {ANALYTICS.labels.map((l, i) => (
                    <div
                      key={i}
                      className="flex-1 text-center font-mono"
                      style={{ fontSize: 9, color: "var(--muted-foreground)", overflow: "hidden" }}
                    >
                      {l.split(" ")[0]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Posts chart */}
              <div className="glass rounded-2xl p-5 shadow-xs" style={{ border: "1px solid var(--border)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {lang === "ar" ? "المنشورات اليومية" : "Daily Posts"}
                </p>
                <div className="flex items-end gap-1.5" style={{ height: 80 }}>
                  {ANALYTICS.dailyPosts.map((val, i) => {
                    const max = Math.max(...ANALYTICS.dailyPosts);
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-t-lg transition-all hover:opacity-80"
                        style={{
                          height: `${(val / max) * 100}%`,
                          background: "linear-gradient(to top, #3b82f6, #06b6d4)",
                          minHeight: 5,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Users tab */}
          {tab === "users" && (
            <div className="glass rounded-2xl p-4 shadow-xs" style={{ border: "1px solid var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                {lang === "ar" ? `جميع الحسابات (${users.length})` : `All Users (${users.length})`}
              </p>
              <div className="flex flex-col gap-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{
                      background: u.banned ? "rgba(244,63,94,0.08)" : "var(--muted)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Av src={u.avatar} name={u.name} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold truncate" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                          {u.name}
                        </span>
                        {u.isVerified && <VerBadge color={u.verificationColor} size={12} />}
                        {u.isAdmin && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold" style={{ background: "#f59e0b22", color: "#f59e0b" }}>
                            ADMIN
                          </span>
                        )}
                        {u.banned && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold" style={{ background: "#f43f5e22", color: "#f43f5e" }}>
                            BANNED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>
                        @{u.handle} · {u.email} · {u.followers.length} {t.followers}
                      </p>
                    </div>
                    {!u.isAdmin && (
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => banUser(u.id)}
                          className="text-xs px-2.5 py-1.5 rounded-lg font-bold active:scale-95 transition-all shadow-2xs"
                          style={{
                            background: u.banned ? "#22c55e22" : "#f43f5e22",
                            color: u.banned ? "#22c55e" : "#f43f5e",
                            fontFamily: "'Outfit', sans-serif",
                          }}
                        >
                          {u.banned ? (lang === "ar" ? "فك الحظر" : "Unban") : (lang === "ar" ? "حظر" : "Ban")}
                        </button>
                        <button
                          type="button"
                          onClick={() => verifyUser(u.id, !u.isVerified)}
                          className="text-xs px-2.5 py-1.5 rounded-lg font-bold active:scale-95 transition-all shadow-2xs"
                          style={{
                            background: "rgba(124,58,237,0.15)",
                            color: "#7c3aed",
                            fontFamily: "'Outfit', sans-serif",
                          }}
                        >
                          {u.isVerified ? (lang === "ar" ? "إلغاء التوثيق" : "Unverify") : (lang === "ar" ? "توثيق" : "Verify")}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts tab */}
          {tab === "posts" && (
            <div className="glass rounded-2xl p-4 shadow-xs" style={{ border: "1px solid var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                {lang === "ar" ? `جميع المنشورات (${posts.length})` : `All Posts (${posts.length})`}
              </p>
              <div className="flex flex-col gap-2">
                {posts.map((p) => {
                  const author = users.find((u) => u.id === p.authorId);
                  return (
                    <div
                      key={p.id}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
                    >
                      {author && <Av src={author.avatar} name={author.name} size={30} />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-bold" style={{ color: "var(--foreground)", fontFamily: "'Outfit', sans-serif" }}>
                            {author?.name}
                          </span>
                          <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                            · {p.time}
                          </span>
                          <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                            · ❤️ {p.likes + p.comments.length}
                          </span>
                        </div>
                        <p className="text-xs line-clamp-2" style={{ color: "var(--card-foreground)", fontFamily: "'Inter', sans-serif" }}>
                          {p.content}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deletePost(p.id)}
                        className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg font-bold active:scale-95"
                        style={{ background: "#f43f5e22", color: "#f43f5e", fontFamily: "'Outfit', sans-serif" }}
                      >
                        {lang === "ar" ? "حذف" : "Delete"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reports tab */}
          {tab === "reports" && (
            <div className="glass rounded-2xl p-4 shadow-xs" style={{ border: "1px solid var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                {lang === "ar" ? `سجل البلاغات والرقابة (${reports.length})` : `Moderation Feed (${reports.length})`}
              </p>
              {reports.length === 0 ? (
                <EmptyState emoji="✅" title={lang === "ar" ? "لا توجد بلاغات" : "No reports"} sub={lang === "ar" ? "الحرم الجامعي خالٍ من المخالفات!" : "All clear!"} />
              ) : (
                reports.map((r: Report) => {
                  const post = posts.find((p) => p.id === r.postId);
                  const reporter = users.find((u) => u.id === r.reportedBy);
                  const postAuthor = post ? users.find((u) => u.id === post.authorId) : null;
                  return (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl mb-3 shadow-xs"
                      style={{
                        background: r.status === "pending" ? "rgba(244,63,94,0.06)" : "var(--muted)",
                        border: "1px solid " + (r.status === "pending" ? "rgba(244,63,94,0.25)" : "var(--border)"),
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                              style={{
                                background: r.status === "pending" ? "#f43f5e22" : "#22c55e22",
                                color: r.status === "pending" ? "#f43f5e" : "#22c55e",
                              }}
                            >
                              {r.status}
                            </span>
                            <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                              {r.createdAt}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}>
                            {r.reason}
                          </p>
                          {reporter && (
                            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                              {lang === "ar" ? "مُقدَّم من" : "Reported by"} @{reporter.handle}
                            </p>
                          )}
                          {post && (
                            <p className="text-xs mt-1 line-clamp-2 italic" style={{ color: "var(--muted-foreground)" }}>
                              "{post.content.slice(0, 80)}..."
                            </p>
                          )}
                          {postAuthor && (
                            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                              {lang === "ar" ? "كاتب المنشور:" : "Post by"} @{postAuthor.handle}
                            </p>
                          )}
                        </div>
                      </div>
                      {r.status === "pending" && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <button
                            type="button"
                            onClick={() => resolveReport(r.id, "delete")}
                            className="text-xs px-3 py-1.5 rounded-lg font-bold active:scale-95 shadow-2xs"
                            style={{ background: "#f43f5e22", color: "#f43f5e", fontFamily: "'Outfit', sans-serif" }}
                          >
                            🗑 {lang === "ar" ? "حذف المحتوى" : "Delete Content"}
                          </button>
                          <button
                            type="button"
                            onClick={() => resolveReport(r.id, "warn")}
                            className="text-xs px-3 py-1.5 rounded-lg font-bold active:scale-95 shadow-2xs"
                            style={{ background: "#f59e0b22", color: "#f59e0b", fontFamily: "'Outfit', sans-serif" }}
                          >
                            ⚠️ {lang === "ar" ? "تحذير الطالب" : "Warn User"}
                          </button>
                          <button
                            type="button"
                            onClick={() => resolveReport(r.id, "dismiss")}
                            className="text-xs px-3 py-1.5 rounded-lg font-bold active:scale-95 shadow-2xs"
                            style={{ background: "var(--muted)", color: "var(--muted-foreground)", fontFamily: "'Outfit', sans-serif" }}
                          >
                            ✕ {lang === "ar" ? "تجاهل" : "Dismiss"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Verify tab */}
          {tab === "verify" && (
            <div className="glass rounded-2xl p-4 shadow-xs" style={{ border: "1px solid var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                {lang === "ar" ? `طلبات التوثيق المعلقة (${pendingVerify.length})` : `Verification Requests (${pendingVerify.length})`}
              </p>
              {pendingVerify.length === 0 ? (
                <EmptyState emoji="✅" title={lang === "ar" ? "لا توجد طلبات معلقة" : "No pending requests"} sub={lang === "ar" ? "تمت معالجة كافة طلبات التوثيق." : "All verification requests handled."} />
              ) : (
                pendingVerify.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 p-4 rounded-2xl mb-3 shadow-xs"
                    style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
                  >
                    <Av src={u.avatar} name={u.name} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                        {u.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        @{u.handle} · {u.university} · {u.studyLevel}
                      </div>
                      <div className="text-[11px] mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>
                        {u.followers.length} {t.followers} · {u.postCount} {t.posts} · {u.email}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => verifyUser(u.id, true)}
                        className="text-xs sm:text-sm px-3.5 py-2 rounded-xl font-bold active:scale-95 shadow-xs"
                        style={{ background: "#22c55e22", color: "#22c55e", fontFamily: "'Outfit', sans-serif" }}
                      >
                        ✓ {lang === "ar" ? "قبول التوثيق" : "Approve"}
                      </button>
                      <button
                        type="button"
                        onClick={() => verifyUser(u.id, false)}
                        className="text-xs sm:text-sm px-3.5 py-2 rounded-xl font-bold active:scale-95 shadow-xs"
                        style={{ background: "#f43f5e22", color: "#f43f5e", fontFamily: "'Outfit', sans-serif" }}
                      >
                        ✕ {lang === "ar" ? "رفض" : "Reject"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
