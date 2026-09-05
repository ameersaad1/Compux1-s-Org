import React from 'react';
import { useApp } from "../store";
import { Av, EmptyState } from "../components/primitives";

export function AlertsView() {
  const {
    notifications,
    currentUser,
    getUserById,
    t,
    lang,
    setView,
    handleNotificationClick,
    markAllNotificationsRead
  } = useApp();

  const dir = lang === "ar" ? "rtl" : "ltr";

  // Filter notifications intended for current user or general
  const userNotifications = currentUser
    ? notifications.filter((n) => !n.recipientId || n.recipientId === currentUser.id)
    : notifications;

  const unread = userNotifications.filter((n) => !n.read).length;
  const icons: Record<string, string> = {
    like: "❤️",
    comment: "💬",
    follow: "👤",
    event: "📅",
    verify: "✓"
  };

  const getTargetBadge = (targetType?: string) => {
    if (targetType === 'post') {
      return lang === 'ar' ? 'عرض المنشور ↗' : 'View Post ↗';
    }
    if (targetType === 'profile') {
      return lang === 'ar' ? 'عرض الملف 👤' : 'View Profile 👤';
    }
    if (targetType === 'event') {
      return lang === 'ar' ? 'عرض الفعالية 📅' : 'View Event 📅';
    }
    if (targetType === 'group') {
      return lang === 'ar' ? 'مجموعة الدراسة 👥' : 'Study Group 👥';
    }
    return null;
  };

  return (
    <div className="gradient-mesh min-h-screen" dir={dir}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 100px" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setView("feed")}
              className="text-xs font-bold hover:opacity-75"
              style={{ color: "var(--muted-foreground)", fontFamily: "'Outfit', sans-serif" }}
            >
              {t.backToFeed}
            </button>
            <h1 className="text-xl font-extrabold" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
              {t.alerts}
            </h1>
            {unread > 0 && (
              <span className="gradient-bg text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                {unread}
              </span>
            )}
          </div>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => markAllNotificationsRead()}
              className="text-xs font-bold active:scale-95 hover:underline"
              style={{ color: "var(--primary)", fontFamily: "'Outfit', sans-serif" }}
            >
              {t.markRead}
            </button>
          )}
        </div>

        {userNotifications.length === 0 ? (
          <EmptyState emoji="🔔" title={t.noAlerts} />
        ) : (
          userNotifications.map((n) => {
            const from = getUserById(n.fromId);
            const targetBadge = getTargetBadge(n.targetType);
            return (
              <div
                key={n.id}
                role="button"
                tabIndex={0}
                onClick={() => handleNotificationClick(n)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNotificationClick(n);
                  }
                }}
                className="flex items-start gap-3.5 px-4 py-3.5 rounded-2xl mb-2.5 transition-all shadow-xs card-hover cursor-pointer text-start group hover:scale-[1.01]"
                style={{
                  background: n.read ? "var(--muted)" : "rgba(109,94,245,0.14)",
                  border: n.read ? "1px solid var(--border)" : "1px solid rgba(109,94,245,0.3)",
                }}
              >
                <div className="shrink-0 text-xl mt-0.5">{icons[n.type] || "🔔"}</div>
                {from && <Av src={from.avatar} name={from.name} size={36} />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-medium leading-snug" style={{ color: "var(--card-foreground)", fontFamily: "'Inter', sans-serif" }}>
                      {n.text}
                    </p>
                    {!n.read && (
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 gradient-bg shadow-xs" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                      {n.time}
                    </span>
                    {targetBadge && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md transition-all group-hover:bg-indigo-600 group-hover:text-white"
                        style={{
                          background: "var(--secondary)",
                          color: "var(--primary)",
                          fontFamily: "'Outfit', sans-serif"
                        }}
                      >
                        {targetBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
