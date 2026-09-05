import React, { useState } from "react";
import { useApp } from "../store";
import { Toggle, VerBadge } from "../components/primitives";
import { OTPModal } from "../components/modals/OTPModal";
import type { User } from "../types";

export function SettingsPage() {
  const {
    currentUser,
    updateUser,
    dark,
    setDark,
    lang,
    setLang,
    setView,
    t,
    requestVerification,
    setCurrentUser,
    showToast,
  } = useApp();
  const [tab, setTab] = useState("profile");
  const [showOTP, setShowOTP] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";
  if (!currentUser) return null;

  const [displayName, setDisplayName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [university, setUniversity] = useState(currentUser.university);
  const [faculty, setFaculty] = useState(currentUser.faculty);
  const [major, setMajor] = useState(currentUser.major);
  const [studyLevel, setStudyLevel] = useState(currentUser.studyLevel);
  const [github, setGithub] = useState(currentUser.github || "");
  const [linkedin, setLinkedin] = useState(currentUser.linkedin || "");
  const [visibility, setVisibility] = useState<"public" | "private" | "friends">("public");
  const [showEmailP, setShowEmailP] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [allowDMs, setAllowDMs] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);
  const [twoFactor, setTwoFactor] = useState(currentUser.isAdmin);
  const [showPhone, setShowPhone] = useState(currentUser.showPhone || false);
  const [notifPosts, setNotifPosts] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifDMs, setNotifDMs] = useState(true);
  const [notifStudy, setNotifStudy] = useState(false);
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");

  function saveProfile() {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      name: displayName,
      bio,
      university,
      faculty,
      major,
      studyLevel,
      github,
      linkedin,
      showPhone,
    };
    updateUser(updated);
    showToast(t.saved);
  }

  const inp: React.CSSProperties = {
    background: "var(--muted)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    width: "100%",
  };

  const rowItem = (label: string, control: React.ReactNode, sub?: string) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--border)" }}>
      <div>
        <p className="text-xs sm:text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "'Outfit', sans-serif" }}>
          {label}
        </p>
        {sub && (
          <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {sub}
          </p>
        )}
      </div>
      {control}
    </div>
  );

  const sec = (label: string) => (
    <p
      className="text-xs font-bold uppercase tracking-widest mb-4"
      style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}
    >
      {label}
    </p>
  );

  const studyLevels = ["Freshman", "Sophomore", "Junior", "Senior", "Masters", "PhD"];

  const settingsNav = [
    { id: "profile", label: t.profileSettings, icon: "👤" },
    { id: "privacy", label: t.privacySettings, icon: "🔒" },
    { id: "notifications", label: t.notifications, icon: "🔔" },
    { id: "appearance", label: t.appearance, icon: "🎨" },
    { id: "verification", label: t.verificationTitle, icon: "✓" },
  ];

  return (
    <div className="gradient-mesh min-h-screen" dir={dir}>
      {showOTP && <OTPModal onClose={() => setShowOTP(false)} />}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 16px 80px", display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Sidebar */}
        <aside
          className="glass rounded-2xl p-3 shrink-0 shadow-sm"
          style={{ border: "1px solid var(--border)", width: 220, alignSelf: "flex-start", position: "sticky", top: 24 }}
        >
          <button
            type="button"
            onClick={() => setView("feed")}
            className="flex items-center gap-2 text-xs mb-4 px-2 py-2 rounded-lg w-full hover:opacity-75 transition-opacity font-bold"
            style={{ color: "var(--muted-foreground)", fontFamily: "'Outfit', sans-serif" }}
          >
            {t.backToFeed}
          </button>
          {settingsNav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-start mb-1 active:scale-95"
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
            </button>
          ))}
          {currentUser.isAdmin && (
            <button
              type="button"
              onClick={() => setView("admin")}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold mt-2 active:scale-95"
              style={{ color: "#f59e0b", fontFamily: "'Outfit', sans-serif" }}
            >
              🛠 {t.adminPanel}
            </button>
          )}
          <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <button
              type="button"
              onClick={() => {
                setCurrentUser(null);
                setView("feed");
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold active:scale-95"
              style={{ color: "#f43f5e", fontFamily: "'Outfit', sans-serif" }}
            >
              🚪 {t.logout}
            </button>
          </div>
        </aside>

        {/* Content panels */}
        <div className="flex-1" style={{ minWidth: 280 }}>
          {tab === "profile" && (
            <div className="glass rounded-2xl p-5 shadow-sm" style={{ border: "1px solid var(--border)" }}>
              {sec(t.profileSettings)}
              <div className="flex flex-col gap-3 mb-5">
                <div>
                  <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                    {t.fullName}
                  </label>
                  <input style={inp} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                    {t.bio}
                  </label>
                  <textarea
                    rows={3}
                    style={{ ...inp, resize: "none" }}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t.bioPlaceholder}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                      {t.university}
                    </label>
                    <input style={inp} value={university} onChange={(e) => setUniversity(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                      {lang === "ar" ? "الكلية" : "Faculty / College"}
                    </label>
                    <input style={inp} value={faculty} onChange={(e) => setFaculty(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                      {t.major}
                    </label>
                    <input style={inp} value={major} onChange={(e) => setMajor(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                      {lang === "ar" ? "المرحلة الدراسية" : "Study Level"}
                    </label>
                    <select
                      style={{ ...inp, cursor: "pointer" }}
                      value={studyLevel}
                      onChange={(e) => setStudyLevel(e.target.value)}
                    >
                      <option value="">{lang === "ar" ? "اختر المرحلة" : "Select level"}</option>
                      {studyLevels.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                      GitHub URL
                    </label>
                    <input
                      style={inp}
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: "var(--muted-foreground)" }}>
                      LinkedIn URL
                    </label>
                    <input
                      style={inp}
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setView("feed")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold active:scale-95"
                  style={{ background: "var(--muted)", color: "var(--muted-foreground)", fontFamily: "'Outfit', sans-serif" }}
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={saveProfile}
                  className="gradient-bg glow px-5 py-2 rounded-xl text-xs font-bold text-white active:scale-95 shadow-md"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {t.saveChanges}
                </button>
              </div>
            </div>
          )}

          {tab === "privacy" && (
            <div className="flex flex-col gap-4">
              <div className="glass rounded-2xl p-5 shadow-sm" style={{ border: "1px solid var(--border)" }}>
                {sec(t.privacySettings)}
                <div className="mb-4">
                  <p className="text-xs sm:text-sm font-semibold mb-2" style={{ color: "var(--foreground)", fontFamily: "'Outfit', sans-serif" }}>
                    {t.profileVisibility}
                  </p>
                  <div className="flex gap-2">
                    {(["public", "private", "friends"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVisibility(v)}
                        className="flex-1 py-2 text-xs font-bold rounded-xl transition-all active:scale-95"
                        style={{
                          background: visibility === v ? "var(--primary)" : "var(--muted)",
                          color: visibility === v ? "#fff" : "var(--muted-foreground)",
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        {v === "public" ? t.publicProfile : v === "private" ? t.privateProfile : t.friendsOnly}
                      </button>
                    ))}
                  </div>
                </div>
                {rowItem(t.showEmail, <Toggle checked={showEmailP} onChange={() => setShowEmailP((v) => !v)} />)}
                {rowItem(t.showActivity, <Toggle checked={showActivity} onChange={() => setShowActivity((v) => !v)} />)}
                {rowItem(t.allowDMs, <Toggle checked={allowDMs} onChange={() => setAllowDMs((v) => !v)} />)}
                {rowItem(t.allowTagging, <Toggle checked={allowTagging} onChange={() => setAllowTagging((v) => !v)} />)}
                {rowItem(t.twoFactor, <Toggle checked={twoFactor} onChange={() => setTwoFactor((v) => !v)} />, twoFactor ? t.enabled : t.disabled)}
                {rowItem(
                  lang === "ar" ? "إظهار رقم الهاتف للزملاء" : "Show Phone Number",
                  <Toggle checked={showPhone} onChange={() => setShowPhone((v) => !v)} />,
                  showPhone ? (lang === "ar" ? "مرئي في الملف الشخصي" : "Visible on profile") : (lang === "ar" ? "مخفي" : "Hidden")
                )}
              </div>

              {/* Phone Verification */}
              <div className="glass rounded-2xl p-5 shadow-sm" style={{ border: "1px solid var(--border)" }}>
                {sec(lang === "ar" ? "توثيق الهاتف المحمول" : "Phone Verification")}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "'Outfit', sans-serif" }}>
                      {lang === "ar" ? "رقم الجوال" : "Mobile Number"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {currentUser.phone ? currentUser.phone : (lang === "ar" ? "لم يُضف بعد" : "Not added yet")}
                      {currentUser.phoneVerified && (
                        <span className="ms-2 text-emerald-500 font-bold">✓ {lang === "ar" ? "موثق" : "Verified"}</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOTP(true)}
                    className="text-xs px-4 py-2 rounded-xl font-bold transition-all hover:opacity-85 active:scale-95 shadow-xs"
                    style={{
                      background: currentUser.phoneVerified ? "var(--muted)" : "var(--primary)",
                      color: currentUser.phoneVerified ? "var(--muted-foreground)" : "#fff",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {currentUser.phoneVerified ? (lang === "ar" ? "تغيير الرقم" : "Change Number") : (lang === "ar" ? "إضافة وتوثيق" : "Add & Verify")}
                  </button>
                </div>
              </div>

              {/* Change password */}
              <div className="glass rounded-2xl p-5 shadow-sm" style={{ border: "1px solid var(--border)" }}>
                {sec(t.changePassword)}
                <div className="flex flex-col gap-3">
                  <input
                    style={inp}
                    type="password"
                    placeholder={t.currentPassword}
                    value={curPass}
                    onChange={(e) => setCurPass(e.target.value)}
                    dir="ltr"
                  />
                  <input
                    style={inp}
                    type="password"
                    placeholder={t.newPassword}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    dir="ltr"
                  />
                  <input
                    style={inp}
                    type="password"
                    placeholder={t.confirmNew}
                    value={confPass}
                    onChange={(e) => setConfPass(e.target.value)}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPass && newPass === confPass) {
                        showToast(t.passwordUpdated);
                        setCurPass("");
                        setNewPass("");
                        setConfPass("");
                      }
                    }}
                    className="gradient-bg glow py-2.5 rounded-xl text-xs font-bold text-white active:scale-95 shadow-xs"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {t.updatePassword}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="glass rounded-2xl p-5 shadow-sm" style={{ border: "1px solid var(--border)" }}>
              {sec(t.notifications)}
              {rowItem(t.notifPosts, <Toggle checked={notifPosts} onChange={() => setNotifPosts((v) => !v)} />, notifPosts ? t.enabled : t.disabled)}
              {rowItem(t.notifEvents, <Toggle checked={notifEvents} onChange={() => setNotifEvents((v) => !v)} />, notifEvents ? t.enabled : t.disabled)}
              {rowItem(t.notifDMs, <Toggle checked={notifDMs} onChange={() => setNotifDMs((v) => !v)} />, notifDMs ? t.enabled : t.disabled)}
              {rowItem(t.notifStudy, <Toggle checked={notifStudy} onChange={() => setNotifStudy((v) => !v)} />, notifStudy ? t.enabled : t.disabled)}
            </div>
          )}

          {tab === "appearance" && (
            <div className="glass rounded-2xl p-5 shadow-sm" style={{ border: "1px solid var(--border)" }}>
              {sec(t.appearance)}
              {rowItem(t.darkMode, <Toggle checked={dark} onChange={() => setDark((d) => !d)} />, dark ? t.enabled : t.disabled)}
              {rowItem(
                t.language,
                <div className="flex gap-2">
                  {(["en", "ar"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLang(l)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95"
                      style={{
                        background: lang === l ? "var(--primary)" : "var(--muted)",
                        color: lang === l ? "#fff" : "var(--muted-foreground)",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {l === "en" ? "English" : "العربية"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "verification" && (
            <div className="glass rounded-2xl p-5 shadow-sm" style={{ border: "1px solid var(--border)" }}>
              {sec(t.verificationTitle)}
              <div
                className="flex items-center gap-4 p-4 rounded-2xl mb-5 shadow-xs"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)" }}
              >
                <VerBadge color="#7c3aed" size={44} />
                <div>
                  <p className="font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                    {t.verificationTitle}
                  </p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}>
                    {t.verificationDesc}
                  </p>
                </div>
              </div>
              <div
                className="p-3 rounded-xl mb-4 text-xs font-mono shadow-inner"
                style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                {t.verificationCriteria}
              </div>
              {currentUser.isVerified ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-500">
                  <VerBadge color="#22c55e" size={18} /> {t.verifyApproved}
                </div>
              ) : currentUser.verificationPending ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-500">
                  ⏳ {t.verifyPending}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={requestVerification}
                  className="gradient-bg glow px-5 py-2.5 rounded-xl text-xs font-bold text-white active:scale-95 shadow-md"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {t.requestVerify}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
