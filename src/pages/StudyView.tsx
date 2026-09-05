import React, { useState, useEffect } from 'react';
import { useApp } from "../store";
import { ResourceItem } from "../components/ResourceItem";
import { EmptyState } from "../components/primitives";
import type { Resource } from "../types";

export function StudyView() {
  const { groups, setGroups, resources, setResources, currentUser, t, lang, setView, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<"pomodoro" | "groups" | "resources">("pomodoro");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "short" | "long">("work");
  const [sessions, setSessions] = useState(3);
  const [searchRes, setSearchRes] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSubject, setUploadSubject] = useState("");
  const [uploadType, setUploadType] = useState<"pdf" | "doc" | "ppt" | "xlsx">("pdf");
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    let interval: any = null;
    if (running && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0 && running) {
      setRunning(false);
      if (mode === "work") {
        setSessions((s) => s + 1);
        showToast(lang === "ar" ? "أحسنت! انتهت جلسة التركيز 🎉 خذ استراحة قصيرة" : "Focus session complete! 🎉 Take a break");
      }
    }
    return () => clearInterval(interval);
  }, [running, seconds, mode, lang, showToast]);

  function switchMode(m: "work" | "short" | "long") {
    setMode(m);
    setRunning(false);
    setSeconds(m === "work" ? 25 * 60 : m === "short" ? 5 * 60 : 15 * 60);
  }

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const totalSecs = mode === "work" ? 25 * 60 : mode === "short" ? 5 * 60 : 15 * 60;
  const progress = ((totalSecs - seconds) / totalSecs) * 100;

  function toggleJoin(id: string) {
    if (!currentUser) return;
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const isMem = g.members.includes(currentUser.id);
        const mems = isMem ? g.members.filter((x) => x !== currentUser.id) : [...g.members, currentUser.id];
        showToast(
          isMem
            ? (lang === "ar" ? "تمت مغادرة المجموعة" : "Left group")
            : (lang === "ar" ? "انضممت لمجموعة المذاكرة! 📚" : "Joined study circle! 📚")
        );
        return { ...g, members: mems };
      })
    );
  }

  function handleUploadResource(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadTitle.trim() || !currentUser) return;
    const newR: Resource = {
      id: "r_" + Date.now(),
      title: uploadTitle.trim(),
      subject: uploadSubject.trim() || "عام",
      fileType: uploadType,
      fileSize: "1.8 MB",
      uploadedBy: currentUser.id,
      uploadedAt: lang === "ar" ? "الآن" : "Just now",
      downloads: 0,
    };
    setResources((prev) => [newR, ...prev]);
    setShowUpload(false);
    setUploadTitle("");
    setUploadSubject("");
    showToast(lang === "ar" ? "تم رفع المرجع بنجاح! 📖" : "Resource uploaded! 📖");
  }

  const subjects = ["all", ...Array.from(new Set(resources.map((r) => r.subject)))];
  const filteredResources = resources.filter((r) => {
    const matchQ = r.title.toLowerCase().includes(searchRes.toLowerCase()) || r.subject.toLowerCase().includes(searchRes.toLowerCase());
    const matchSub = filterSubject === "all" || r.subject === filterSubject;
    return matchQ && matchSub;
  });

  return (
    <div className="gradient-mesh min-h-screen" dir={dir}>
      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass rounded-3xl p-6 w-full max-w-md shadow-2xl border" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm sm:text-base" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                {lang === "ar" ? "رفع مرجع أو ملخص دراسي" : "Upload Study Material"}
              </h3>
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-75"
                style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUploadResource} className="flex flex-col gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {lang === "ar" ? "عنوان الملف / المحاضرة" : "File / Note Title"}
                </label>
                <input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: تلخيص فيزياء عامة 101" : "e.g. Physics 101 Notes"}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {lang === "ar" ? "المادة" : "Subject"}
                </label>
                <input
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: تفاضل وتكامل" : "e.g. Calculus"}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {lang === "ar" ? "صيغة الملف" : "File Type"}
                </label>
                <div className="flex gap-2">
                  {(["pdf", "doc", "ppt", "xlsx"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUploadType(t)}
                      className="flex-1 py-2 text-xs font-bold rounded-xl transition-all uppercase"
                      style={{
                        background: uploadType === t ? "var(--primary)" : "var(--muted)",
                        color: uploadType === t ? "#fff" : "var(--muted-foreground)",
                      }}
                    >
                      .{t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                >
                  {t.cancel}
                </button>
                <button type="submit" className="gradient-bg glow px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95">
                  {lang === "ar" ? "رفع الملف" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            {t.studyHub}
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "pomodoro", label: t.pomodoro, icon: "⏱" },
            { id: "groups", label: t.studyGroupsLabel, icon: "👥" },
            { id: "resources", label: t.resources, icon: "📚" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-2xs"
              style={{
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg,#4f46e5,#7c3aed)"
                    : "var(--muted)",
                color: activeTab === tab.id ? "#fff" : "var(--muted-foreground)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pomodoro Tab */}
        {activeTab === "pomodoro" && (
          <div className="flex flex-col items-center">
            <div className="glass rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border" style={{ borderColor: "var(--border)" }}>
              {/* Mode switch */}
              <div className="flex gap-1.5 p-1 rounded-2xl mb-8" style={{ background: "var(--muted)" }}>
                {[
                  { id: "work", label: t.workTime },
                  { id: "short", label: t.shortBreak },
                  { id: "long", label: t.longBreak },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => switchMode(m.id as typeof mode)}
                    className="flex-1 py-1.5 text-xs font-bold rounded-xl transition-all"
                    style={{
                      background: mode === m.id ? "var(--primary)" : "transparent",
                      color: mode === m.id ? "#fff" : "var(--muted-foreground)",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Timer dial */}
              <div className="relative w-52 h-52 mx-auto mb-8 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="var(--muted)" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="url(#timerGrad)"
                    strokeWidth="6"
                    strokeDasharray="276"
                    strokeDashoffset={276 - (276 * progress) / 100}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                  />
                  <defs>
                    <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-black font-mono tracking-tight" style={{ color: "var(--foreground)" }}>
                    {mins}:{secs}
                  </span>
                  <span className="block text-xs mt-1 font-semibold" style={{ color: "var(--muted-foreground)" }}>
                    {mode === "work" ? "🧠 وقت التركيز" : "☕ استراحة"}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setRunning((r) => !r)}
                  className="gradient-bg glow px-8 py-3 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-95 transition-all"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {running ? t.pause : t.start}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRunning(false);
                    switchMode(mode);
                  }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all active:scale-95"
                  style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                  title={t.reset}
                >
                  ↺
                </button>
              </div>

              {/* Stats footer */}
              <div className="flex items-center justify-around mt-8 pt-5 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                <div>
                  <span className="block text-base font-extrabold" style={{ color: "var(--foreground)" }}>
                    {sessions}
                  </span>
                  <span>{t.sessions}</span>
                </div>
                <div>
                  <span className="block text-base font-extrabold text-emerald-500">
                    {Math.round(sessions * 0.42 * 10) / 10}h
                  </span>
                  <span>{t.studyHours}</span>
                </div>
                <div>
                  <span className="block text-base font-extrabold text-amber-500">🔥 4</span>
                  <span>{lang === "ar" ? "أيام متتالية" : "Day Streak"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Study Groups Tab */}
        {activeTab === "groups" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((g) => {
              const joined = currentUser && g.members.includes(currentUser.id);
              const fill = (g.members.length / g.maxMembers) * 100;
              return (
                <div key={g.id} className="glass rounded-2xl p-5 card-hover shadow-xs" style={{ border: "1px solid var(--border)" }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                          {g.name}
                        </h3>
                        {g.active && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-600">
                            {t.activeNow}
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {g.subject}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleJoin(g.id)}
                      className="text-xs px-3.5 py-1.5 rounded-full font-bold active:scale-95 transition-all shadow-xs"
                      style={{
                        background: joined ? "var(--primary)" : "var(--secondary)",
                        color: joined ? "#fff" : "var(--secondary-foreground)",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {joined ? t.joined : t.join}
                    </button>
                  </div>

                  <div className="h-1.5 rounded-full overflow-hidden my-3" style={{ background: "var(--muted)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: fill + "%", background: `linear-gradient(90deg, ${g.color}, #a855f7)` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <span className="font-mono">
                      {g.members.length}/{g.maxMembers} {lang === "ar" ? "أعضاء" : "members"}
                    </span>
                    <span>
                      {t.next}: <span className="font-medium text-neutral-800 dark:text-neutral-200">{g.nextSession}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <input
                value={searchRes}
                onChange={(e) => setSearchRes(e.target.value)}
                placeholder={lang === "ar" ? "ابحث في المراجع والمذكرات..." : "Search resources..."}
                className="text-xs px-4 py-2.5 rounded-xl border outline-none min-w-[200px] flex-1"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className="gradient-bg glow px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                + {lang === "ar" ? "رفع ملخص جديد" : "Upload Material"}
              </button>
            </div>

            {/* Subject Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setFilterSubject(sub)}
                  className="text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all active:scale-95 shadow-2xs"
                  style={{
                    background: filterSubject === sub ? "var(--primary)" : "var(--muted)",
                    color: filterSubject === sub ? "#fff" : "var(--muted-foreground)",
                  }}
                >
                  {sub === "all" ? (lang === "ar" ? "الكل" : "All") : sub}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {filteredResources.length === 0 ? (
                <EmptyState emoji="📚" title={lang === "ar" ? "لا توجد مراجع مطابقة" : "No resources found"} />
              ) : (
                filteredResources.map((r) => <ResourceItem key={r.id} resource={r} />)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
