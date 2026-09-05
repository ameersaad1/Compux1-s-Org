import React from 'react';
import { useApp } from "../../store";
import { Av, VerBadge } from "../primitives";
import type { User } from "../../types";

export function FollowModal({
  userId,
  mode,
  onClose,
}: {
  userId: string;
  mode: "followers" | "following";
  onClose: () => void;
}) {
  const { users, getUserById, t, followUser, isFollowing, setView, setViewUserId, currentUser } = useApp();
  const user = getUserById(userId);
  if (!user) return null;

  const ids = mode === "followers" ? user.followers : user.following;
  const list = ids.map((id) => users.find((u) => u.id === id)).filter(Boolean) as User[];

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
        style={{ border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2
            className="font-bold text-sm"
            style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
          >
            {mode === "followers" ? t.followersList : t.followingList} ({list.length})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs p-1 hover:opacity-75 transition-opacity"
            style={{ color: "var(--muted-foreground)" }}
          >
            ✕
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {list.length === 0 ? (
            <p className="text-center py-6 text-xs" style={{ color: "var(--muted-foreground)" }}>
              — لا يوجد طلاب هنا حتى الآن —
            </p>
          ) : (
            list.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setViewUserId(u.id);
                    setView("profile");
                    onClose();
                  }}
                >
                  <Av src={u.avatar} name={u.name} size={36} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="text-xs font-semibold hover:underline truncate"
                      style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
                      onClick={() => {
                        setViewUserId(u.id);
                        setView("profile");
                        onClose();
                      }}
                    >
                      {u.name}
                    </button>
                    {u.isVerified && <VerBadge color={u.verificationColor} size={11} />}
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    @{u.handle}
                  </p>
                </div>
                {currentUser && currentUser.id !== u.id && (
                  <button
                    type="button"
                    onClick={() => followUser(u.id)}
                    className="text-xs px-3 py-1.5 rounded-full font-medium transition-all active:scale-95"
                    style={{
                      background: isFollowing(u.id) ? "var(--muted)" : "var(--primary)",
                      color: isFollowing(u.id) ? "var(--muted-foreground)" : "#fff",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {isFollowing(u.id) ? t.followingBtn : t.followBtn}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
