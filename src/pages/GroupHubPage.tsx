import React, { useState } from 'react';
import { useApp } from "../store";
import { Av, EmptyState } from "../components/primitives";
import type { StudyGroup } from "../types";

export function GroupHubPage() {
  const { groups, setGroups, currentUser, t, lang, setView, showToast } = useApp();
  const [filter, setFilter] = useState<'all' | 'my' | 'active'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupSubject, setNewGroupSubject] = useState("");
  const [newGroupSession, setNewGroupSession] = useState("");
  const dir = lang === "ar" ? "rtl" : "ltr";

  function toggleJoin(id: string) {
    if (!currentUser) return;
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const isMember = g.members.includes(currentUser.id);
        const updatedMembers = isMember
          ? g.members.filter((x) => x !== currentUser.id)
          : g.members.length < g.maxMembers
          ? [...g.members, currentUser.id]
          : g.members;

        showToast(
          isMember
            ? (lang === "ar" ? "تمت مغادرة المجموعة" : "Left group")
            : (lang === "ar" ? "انضممت لمجموعة المذاكرة بنجاح! 📚" : "Joined study circle! 📚")
        );
        return { ...g, members: updatedMembers };
      })
    );
  }

  function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupSubject.trim() || !currentUser) return;

    const newGroup: StudyGroup = {
      id: "g_" + Date.now(),
      name: newGroupName.trim(),
      subject: newGroupSubject.trim(),
      members: [currentUser.id],
      maxMembers: 10,
      nextSession: newGroupSession.trim() || (lang === "ar" ? "قريباً" : "TBD"),
      color: "#6d5ef5",
      active: true,
    };

    setGroups((prev) => [newGroup, ...prev]);
    setShowCreateModal(false);
    setNewGroupName("");
    setNewGroupSubject("");
    setNewGroupSession("");
    showToast(lang === "ar" ? "تم إنشاء مجموعة المذاكرة بنجاح! ✨" : "Study circle created successfully! ✨");
  }

  const filteredGroups = groups.filter((g) => {
    if (filter === 'my') return currentUser ? g.members.includes(currentUser.id) : true;
    if (filter === 'active') return g.active;
    return true;
  });

  return (
    <div className="gradient-mesh min-h-screen" dir={dir}>
      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            className="glass rounded-3xl p-6 w-full max-w-md shadow-2xl border"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                {lang === "ar" ? "إنشاء حلقة استذكار أكاديمية جديدة" : "Create New Study Circle"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-75"
                style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="flex flex-col gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {lang === "ar" ? "اسم المجموعة" : "Group Name"}
                </label>
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: مراجعة الخوارزميات وهياكل البيانات" : "e.g. Algorithms Review Group"}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {lang === "ar" ? "المادة والكلية" : "Subject & College"}
                </label>
                <input
                  value={newGroupSubject}
                  onChange={(e) => setNewGroupSubject(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: علوم الحاسوب · الفصل الأول" : "e.g. Computer Science · Term 1"}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {lang === "ar" ? "موعد الجلسة القادمة" : "Next Session Schedule"}
                </label>
                <input
                  value={newGroupSession}
                  onChange={(e) => setNewGroupSession(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: الثلاثاء، الساعة 5:00 مساءً" : "e.g. Tuesday, 5:00 PM"}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="gradient-bg glow px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95"
                >
                  {lang === "ar" ? "إنشاء المجموعة" : "Create Circle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 840, margin: "0 auto", padding: "24px 16px 100px" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setView("feed")}
              className="text-xs font-bold hover:opacity-75 transition-opacity"
              style={{ color: "var(--muted-foreground)", fontFamily: "'Outfit', sans-serif" }}
            >
              {t.backToFeed}
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {t.studyGroupsLabel}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="gradient-bg glow px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            + {lang === "ar" ? "إنشاء حلقة استذكار" : "New Circle"}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-5">
          {[
            { id: 'all', label: lang === "ar" ? "كل الحلقات" : "All Circles" },
            { id: 'active', label: lang === "ar" ? "النشطة حالياً" : "Active Now" },
            { id: 'my', label: lang === "ar" ? "حلقاتي المنضم لها" : "My Circles" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id as typeof filter)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-2xs"
              style={{
                background: filter === f.id ? "var(--primary)" : "var(--muted)",
                color: filter === f.id ? "#fff" : "var(--muted-foreground)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <EmptyState
            emoji="📚"
            title={lang === "ar" ? "لا توجد حلقات مطابقة" : "No study groups found"}
            sub={lang === "ar" ? "يمكنك إنشاء حلقة استذكار جديدة لدعوة زملائك!" : "Create a new circle to invite your peers!"}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGroups.map((g) => {
              const joined = currentUser ? g.members.includes(currentUser.id) : false;
              const fill = (g.members.length / g.maxMembers) * 100;
              return (
                <div
                  key={g.id}
                  className="glass rounded-2xl p-5 card-hover shadow-xs flex flex-col justify-between"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <div>
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
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2" style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)" }}>
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
      </div>
    </div>
  );
}
