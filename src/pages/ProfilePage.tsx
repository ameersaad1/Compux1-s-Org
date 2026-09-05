import React, { useState, useEffect } from "react";
import { useApp } from "../store";
import { VerBadge, EmptyState } from "../components/primitives";
import { LightboxModal } from "../components/modals/LightboxModal";
import { BadgeModal } from "../components/modals/BadgeModal";
import { FollowModal } from "../components/modals/FollowModal";
import { EditProfileModal } from "../components/modals/EditProfileModal";
import { ReportUserModal } from "../components/modals/ReportUserModal";
import { PostCard } from "../components/PostCard";
import { ResourceItem } from "../components/ResourceItem";
import type { Badge, User } from "../types";

export function ProfilePage() {
  const {
    viewUserId,
    currentUser,
    getUserById,
    setView,
    followUser,
    isFollowing,
    posts,
    events,
    resources,
    uploadUserPhoto,
    showToast,
    lang,
    t,
  } = useApp();

  const userId = viewUserId || currentUser?.id || "";
  const isRTL = lang === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  // State
  const [profileUser, setProfileUser] = useState<User | null>(() => getUserById(userId) || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [profileTab, setProfileTab] = useState<"posts" | "media" | "resources" | "events">("posts");
  const [followModal, setFollowModal] = useState<"followers" | "following" | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Decoupled Fetch from Server with Fallback
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    async function loadProfile() {
      if (!userId) {
        if (isMounted) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(`/api/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.profile) {
            setProfileUser(data.profile);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch decoupled profile from server, using local store:", err);
      }

      // Local fallback
      const localUser = getUserById(userId);
      if (isMounted) {
        if (localUser) {
          setProfileUser(localUser);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [userId, getUserById]);

  // Keep profile user updated if current user changes (e.g. from local edits)
  useEffect(() => {
    if (currentUser && profileUser && currentUser.id === profileUser.id) {
      setProfileUser(currentUser);
    }
  }, [currentUser]);

  // Handlers
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    setUploadingAvatar(true);
    const res = await uploadUserPhoto("avatar", file);
    if (res.success && res.url) {
      setProfileUser((prev) => (prev ? { ...prev, avatar: res.url! } : prev));
    }
    setUploadingAvatar(false);
    e.target.value = "";
  };

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    setUploadingCover(true);
    const res = await uploadUserPhoto("cover", file);
    if (res.success && res.url) {
      setProfileUser((prev) => (prev ? { ...prev, coverUrl: res.url! } : prev));
    }
    setUploadingCover(false);
    e.target.value = "";
  };

  const handleShare = async () => {
    if (!profileUser) return;
    const shareUrl = window.location.origin + `?profile=${profileUser.handle}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        showToast(isRTL ? "تم نسخ رابط الحساب للحافظة! 🔗" : "Profile link copied to clipboard! 🔗");
      } else {
        showToast(isRTL ? `رابط الحساب: @${profileUser.handle}` : `Handle: @${profileUser.handle}`);
      }
    } catch {
      showToast(isRTL ? `رابط الحساب: @${profileUser.handle}` : `Handle: @${profileUser.handle}`);
    }
  };

  // ====================================================
  // STATE 1: LOADING SKELETON (Decoupled Bone Shimmer)
  // ====================================================
  if (loading) {
    return (
      <div className="gradient-mesh min-h-screen pb-20" dir={dir}>
        {/* Cover Skeleton */}
        <div className="h-48 sm:h-56 w-full bg-zinc-300 dark:bg-zinc-800 animate-pulse relative" />

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 16px" }}>
          {/* Avatar & Actions Skeleton */}
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-5">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-zinc-400 dark:bg-zinc-700 animate-pulse border-4 border-background" />
            <div className="flex gap-2 pb-2">
              <div className="w-24 h-10 rounded-xl bg-zinc-300 dark:bg-zinc-800 animate-pulse" />
              <div className="w-28 h-10 rounded-xl bg-zinc-300 dark:bg-zinc-800 animate-pulse" />
            </div>
          </div>

          {/* Info Skeletons */}
          <div className="w-48 h-7 bg-zinc-300 dark:bg-zinc-700 rounded-lg animate-pulse mb-2" />
          <div className="w-32 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse mb-4" />
          <div className="w-full max-w-lg h-14 bg-zinc-200 dark:bg-zinc-800/80 rounded-xl animate-pulse mb-6" />

          {/* Stats Skeletons */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-18 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>

          {/* Tabs & Posts Skeletons */}
          <div className="h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse mb-4" />
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // STATE 2: ERROR 404 NOT FOUND STATE
  // ====================================================
  if (notFound || !profileUser) {
    return (
      <div className="gradient-mesh min-h-screen flex items-center justify-center p-4" dir={dir}>
        <div
          className="w-full max-w-md rounded-3xl glass p-8 text-center border shadow-xl"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <div className="w-20 h-20 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center text-3xl mx-auto mb-4 border border-rose-500/30">
            🔍
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {isRTL ? "الحساب الجامعي غير موجود (404)" : "Student Profile Not Found (404)"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
            {isRTL
              ? "لم يتم العثور على الطالب بالمعرّف المطلوب أو ربما تم تغيير المعرّف الجامعي أو إيقاف الحساب."
              : "The requested student handle does not exist in the campus directory or has been deactivated."}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => setView("feed")}
              className="gradient-bg px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md active:scale-95 transition-all"
            >
              {t.backToFeed}
            </button>
            <button
              type="button"
              onClick={() => setView("explore")}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm border hover:bg-muted text-foreground transition-all"
              style={{ borderColor: "var(--border)" }}
            >
              {isRTL ? "استكشاف الطلاب" : "Explore Students"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User logic
  const isMe = currentUser?.id === profileUser.id;
  const following = isFollowing(profileUser.id);
  const userPosts = posts.filter((p) => p.authorId === profileUser.id);
  const mediaPosts = userPosts.filter((p) => p.image);
  const userResources = resources.filter((r) => r.uploadedBy === profileUser.id);
  const userEvents = events.filter((ev) => ev.attending.includes(profileUser.id));
  const isNewStudentEmpty = userPosts.length === 0 && userResources.length === 0 && userEvents.length === 0;

  const tabs = [
    { id: "posts", label: isRTL ? "المنشورات" : "Posts", icon: "📝", count: userPosts.length },
    { id: "media", label: isRTL ? "الميديا" : "Media", icon: "🖼", count: mediaPosts.length },
    { id: "resources", label: isRTL ? "المصادر" : "Resources", icon: "📚", count: userResources.length },
    { id: "events", label: isRTL ? "الفعاليات" : "Events", icon: "📅", count: userEvents.length },
  ] as const;

  return (
    <div className="gradient-mesh min-h-screen pb-24" dir={dir}>
      {/* Lightbox & Modals */}
      {lightboxSrc && <LightboxModal src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      {selectedBadge && <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />}
      {followModal && <FollowModal userId={profileUser.id} mode={followModal} onClose={() => setFollowModal(null)} />}
      {editModalOpen && <EditProfileModal user={profileUser} onClose={() => setEditModalOpen(false)} />}
      {reportModalOpen && <ReportUserModal targetUser={profileUser} onClose={() => setReportModalOpen(false)} />}

      {/* ==================================================== */}
      {/* COVER BANNER (With Magic-Bytes Photo Upload for Owner) */}
      {/* ==================================================== */}
      <div
        className="relative h-48 sm:h-60 overflow-hidden bg-cover bg-center"
        style={{
          background: profileUser.coverUrl
            ? `url(${profileUser.coverUrl}) center/cover no-repeat`
            : "linear-gradient(135deg,#4f46e5,#7c3aed,#3b82f6)",
        }}
      >
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

        {/* Navigation Shortcut */}
        <button
          type="button"
          onClick={() => setView("feed")}
          className="absolute top-4 start-4 glass px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <span>←</span>
          <span>{t.backToFeed}</span>
        </button>

        {/* OWNER COVER CONTROLS */}
        {isMe && (
          <label className="absolute top-4 end-4 glass px-3.5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-md active:scale-95 transition-all flex items-center gap-1.5 hover:bg-black/50">
            <span>📷</span>
            <span>{uploadingCover ? (isRTL ? "جارٍ الفحص..." : "Checking...") : (isRTL ? "تغيير الغلاف" : "Change Cover")}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploadingCover}
              onChange={handleCoverFile}
            />
          </label>
        )}
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 16px" }}>
        {/* ==================================================== */}
        {/* AVATAR & ROLE-BASED ACTIONS (Owner vs Visitor)       */}
        {/* ==================================================== */}
        <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-5">
          {/* Avatar Container */}
          <div className="relative group">
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover shadow-2xl bg-muted"
              style={{
                border: "4px solid var(--background)",
                boxShadow: "0 0 30px rgba(109,94,245,0.35)",
              }}
            />

            {/* OWNER AVATAR UPLOAD OVERLAY */}
            {isMe && (
              <label className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white border-4 border-transparent">
                <span className="text-xl">📷</span>
                <span className="text-[10px] font-bold mt-1">
                  {uploadingAvatar ? (isRTL ? "تدقيق..." : "Validating...") : (isRTL ? "تعديل الصورة" : "Edit Avatar")}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={uploadingAvatar}
                  onChange={handleAvatarFile}
                />
              </label>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2 pb-2">
            {isMe ? (
              /* OWNER ACTIONS */
              <>
                <button
                  type="button"
                  onClick={() => setView("settings")}
                  className="glass px-3.5 py-2 rounded-xl text-sm font-semibold hover:opacity-80 transition-all active:scale-95 shadow-xs"
                  style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                  title={t.settings}
                >
                  ⚙️
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="gradient-bg glow px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <span>✏️</span>
                  <span>{t.editProfile}</span>
                </button>
              </>
            ) : (
              /* VISITOR ACTIONS */
              <>
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => followUser(profileUser.id)}
                    className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                    style={{
                      background: following ? "var(--muted)" : "linear-gradient(135deg,#4f46e5,#7c3aed)",
                      color: following ? "var(--foreground)" : "#fff",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    <span>{following ? "✓" : "+"}</span>
                    <span>{following ? t.followingBtn : t.followBtn}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setView("messages")}
                  className="glass px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold hover:opacity-85 active:scale-95 transition-all flex items-center gap-1"
                  style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                  title={isRTL ? "مراسلة مباشرة" : "Direct Message"}
                >
                  <span>💬</span>
                  <span className="hidden sm:inline">{isRTL ? "مراسلة" : "Message"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="glass px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold hover:opacity-85 active:scale-95 transition-all"
                  style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                  title={isRTL ? "مشاركة الحساب" : "Share Profile"}
                >
                  🔗
                </button>

                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="glass px-2.5 py-2 rounded-xl text-xs sm:text-sm text-rose-500 font-semibold hover:bg-rose-500/10 active:scale-95 transition-all"
                  style={{ border: "1px solid var(--border)" }}
                  title={isRTL ? "إبلاغ عن الحساب" : "Report Profile"}
                >
                  🚩
                </button>
              </>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* NAME, USERNAME, VERIFICATION & BADGES                */}
        {/* ==================================================== */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {profileUser.name}
              </h1>
              {profileUser.isVerified && <VerBadge color={profileUser.verificationColor} size={22} />}
              {profileUser.isAdmin && (
                <span
                  className="text-xs px-2 py-0.5 rounded-lg font-mono font-bold"
                  style={{ background: "#f59e0b22", color: "#f59e0b" }}
                >
                  🛠 DEV
                </span>
              )}
              {isMe && profileUser.showPhone && profileUser.phone && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium">
                  📱 {profileUser.phone}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm mt-0.5 text-muted-foreground font-mono">
              @{profileUser.handle}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-2">
            {profileUser.github && (
              <a
                href={profileUser.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80 active:scale-95 shadow-xs"
                style={{ background: "var(--muted)", color: "var(--foreground)" }}
                aria-label="GitHub Profile"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
            {profileUser.linkedin && (
              <a
                href={profileUser.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80 active:scale-95 shadow-xs"
                style={{ background: "var(--muted)", color: "#0077b5" }}
                aria-label="LinkedIn Profile"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* University Info Bar */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {profileUser.university && (
            <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(109,94,245,0.12)", color: "#6d5ef5" }}>
              🏛 {profileUser.university}
            </span>
          )}
          {profileUser.faculty && (
            <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
              🏫 {profileUser.faculty}
            </span>
          )}
          {profileUser.major && (
            <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>
              📐 {profileUser.major}
            </span>
          )}
          {profileUser.studyLevel && (
            <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
              🎓 {profileUser.studyLevel}
            </span>
          )}
        </div>

        {/* Bio */}
        {profileUser.bio && (
          <p className="text-xs sm:text-sm leading-relaxed mb-4 text-foreground whitespace-pre-line">
            {profileUser.bio}
          </p>
        )}

        {/* Gamification Badges */}
        {profileUser.badges && profileUser.badges.length > 0 && (
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-muted-foreground font-mono">
              {isRTL ? "الشارات والجوائز الأكاديمية" : "Academic Badges"}
            </p>
            <div className="flex flex-wrap gap-2">
              {profileUser.badges.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBadge(b)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80 active:scale-95 shadow-xs"
                  style={{
                    background: b.color + "18",
                    border: "1px solid " + b.color + "44",
                    color: b.color,
                  }}
                  title={b.name}
                >
                  <span>{b.emoji}</span> {isRTL ? b.nameAr : b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
          {[
            { label: isRTL ? t.posts : "Posts", value: userPosts.length, click: () => setProfileTab("posts") },
            { label: isRTL ? t.followers : "Followers", value: profileUser.followers.length, click: () => setFollowModal("followers") },
            { label: isRTL ? t.following : "Following", value: profileUser.following.length, click: () => setFollowModal("following") },
            { label: isRTL ? t.studyHours : "Study Hrs", value: profileUser.isAdmin ? "∞" : (profileUser.studyHours || 0) + "h", click: undefined },
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={s.click}
              className="glass rounded-2xl p-3 text-center transition-all hover:opacity-85 active:scale-95"
              style={{ border: "1px solid var(--border)", cursor: s.click ? "pointer" : "default" }}
            >
              <p className="text-lg sm:text-xl font-extrabold gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {s.value}
              </p>
              <p className="text-[11px] mt-0.5 text-muted-foreground">
                {s.label}
              </p>
            </button>
          ))}
        </div>

        {/* Profile Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: "var(--muted)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setProfileTab(tab.id as typeof profileTab)}
              className="flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
              style={{
                background: profileTab === tab.id ? "var(--primary)" : "transparent",
                color: profileTab === tab.id ? "#fff" : "var(--muted-foreground)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="text-[10px] opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* ==================================================== */}
        {/* TAB CONTENTS (Posts, Media, Resources, Events)       */}
        {/* ==================================================== */}
        {profileTab === "posts" && (
          <div className="flex flex-col gap-3">
            {userPosts.length === 0 ? (
              isNewStudentEmpty ? (
                /* STATE 3: ONBOARDING EMPTY STATE FOR NEW STUDENT */
                <div
                  className="rounded-3xl glass p-8 text-center border shadow-xs"
                  style={{ borderColor: "var(--border)", background: "var(--card)" }}
                >
                  <div className="text-4xl mb-3">🌱</div>
                  <h3 className="font-extrabold text-base sm:text-lg text-foreground mb-1">
                    {isRTL ? "مرحباً بك في الحرم الجامعي!" : "Welcome to the Campus Network!"}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto mb-5 leading-relaxed">
                    {isMe
                      ? (isRTL 
                          ? "حسابك الأكاديمي موثوق وجاهز. ابدأ بنشر أول مشاركة علمية أو شارك ملخصاتك مع زملائك في الكلية!" 
                          : "Your academic account is set up. Start sharing your technical thoughts and study notes!")
                      : (isRTL 
                          ? `الطالب @${profileUser.handle} مستجد في المنصة ولم يقم بنشر أي محتوى بعد. كن أول من يرحب به!` 
                          : `Student @${profileUser.handle} is new to the campus and hasn't posted yet. Send a greeting!`)}
                  </p>
                  {isMe ? (
                    <button
                      type="button"
                      onClick={() => setView("feed")}
                      className="gradient-bg px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 transition-all"
                    >
                      {isRTL ? "كتابة أول منشور ✍️" : "Write First Post ✍️"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setView("messages")}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs border hover:bg-muted text-foreground transition-all"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {isRTL ? "إرسال رسالة ترحيبية 💬" : "Send Welcome Message 💬"}
                    </button>
                  )}
                </div>
              ) : (
                <EmptyState
                  emoji="📝"
                  title={isRTL ? "لا توجد منشورات بعد" : "No posts yet"}
                  sub={isRTL ? "المشاركات المنشورة من قبل هذا الطالب ستظهر هنا." : "Posts will appear here once shared."}
                />
              )
            ) : (
              /* STATE 4: FILLED POSTS */
              userPosts.map((p) => <PostCard key={p.id} post={p} />)
            )}
          </div>
        )}

        {profileTab === "media" && (
          mediaPosts.length === 0 ? (
            <EmptyState
              emoji="🖼"
              title={isRTL ? "لا توجد وسائط بعد" : "No media yet"}
              sub={isRTL ? "المنشورات المحتوية على صور ومشاريع مرئية ستظهر هنا." : "Posts containing project images will appear here."}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {mediaPosts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setLightboxSrc(p.image!)}
                  className="aspect-square rounded-2xl overflow-hidden glass border hover:scale-102 transition-transform relative group"
                  style={{ borderColor: "var(--border)" }}
                >
                  <img src={p.image} alt="media thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg">
                    🔍
                  </div>
                </button>
              ))}
            </div>
          )
        )}

        {profileTab === "resources" && (
          userResources.length === 0 ? (
            <EmptyState
              emoji="📚"
              title={isRTL ? "لم يتم رفع مصادر بعد" : "No resources uploaded"}
              sub={isRTL ? "شارك ملخصاتك والكتب المعتمدة للمساعدة الأكاديمية." : "Upload approved study guides to support your peers."}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {userResources.map((r) => (
                <ResourceItem key={r.id} resource={r} />
              ))}
            </div>
          )
        )}

        {profileTab === "events" && (
          userEvents.length === 0 ? (
            <EmptyState
              emoji="📅"
              title={isRTL ? "لم ينضم لفعاليات بعد" : "No events joined"}
              sub={isRTL ? "سجل حضورك في ورش العمل والملتقيات الجامعية لتظهر هنا." : "RSVP to campus workshops to display them on your profile."}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {userEvents.map((ev) => (
                <div key={ev.id} className="glass rounded-2xl p-4 card-hover" style={{ border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: ev.color + "22" }}>
                      {ev.emoji}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {ev.title}
                      </p>
                      <p className="text-xs mt-0.5 text-muted-foreground">
                        📅 {ev.date} · 🕐 {ev.time} · 📍 {ev.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
