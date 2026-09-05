import React, { useState } from 'react';
import { useApp, INITIAL_USERS } from "../store";
import { CompuxLogo } from "../components/primitives";
import type { User } from "../types";

export function AuthScreen() {
  const { t, lang, setLang, setView, dark, setDark, registerUser, loginUser } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showDev, setShowDev] = useState(false);
  const [loading, setLoading] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const devUser = INITIAL_USERS[0];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(email, password);
      setLoading(false);
      if (!res.success) {
        setError(res.error || t.wrongCreds);
      } else {
        setView("feed");
      }
    } catch {
      setLoading(false);
      setError(t.wrongCreds);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(t.passMismatch);
      return;
    }
    if (password.length < 4) {
      setError(lang === "ar" ? "كلمة المرور يجب أن تتكون من 4 أحرف أو أرقام على الأقل" : "Password must be at least 4 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await registerUser({
        email,
        password,
        name: fullName.trim(),
        university: university.trim() || undefined,
        major: major.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setLoading(false);
      if (!res.success) {
        setError(res.error || "فشل تسجيل الحساب");
      } else {
        setView("feed");
      }
    } catch {
      setLoading(false);
      setError("حدث خطأ أثناء الاتصال بالسيرفر");
    }
  }

  const inp: React.CSSProperties = {
    background: "var(--muted)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: 12,
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    width: "100%",
  };

  return (
    <div className="gradient-mesh min-h-screen flex items-center justify-center p-4 relative" dir={dir}>
      {/* Top right language and dark mode switches */}
      <div className="fixed top-4 end-4 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="text-xs px-3 py-1.5 rounded-full font-semibold glass border shadow-xs transition-all hover:opacity-80 active:scale-95"
          style={{ borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "'Outfit', sans-serif" }}
        >
          {lang === "en" ? "العربية" : "English"}
        </button>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm glass border shadow-xs transition-all hover:opacity-80 active:scale-95"
          style={{ borderColor: "var(--border)" }}
          aria-label="Toggle dark mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="w-full max-w-sm my-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="glow rounded-2xl p-3 mb-3" style={{ background: "var(--secondary)" }}>
            <CompuxLogo size={46} />
          </div>
          <h1 className="text-3xl font-extrabold gradient-text tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {t.appName}
          </h1>
          <p className="text-xs mt-1 font-medium" style={{ color: "var(--muted-foreground)" }}>
            {t.tagline}
          </p>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-7 shadow-xl" style={{ border: "1px solid var(--border)" }}>
          <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: "var(--muted)" }}>
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className="flex-1 py-2 text-xs font-bold rounded-lg transition-all active:scale-95"
                style={{
                  background: mode === m ? "var(--primary)" : "transparent",
                  color: mode === m ? "#fff" : "var(--muted-foreground)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {m === "login" ? t.login : t.signup}
              </button>
            ))}
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="flex flex-col gap-3">
            {mode === "signup" && (
              <>
                <input
                  style={inp}
                  placeholder={t.fullName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <input
                  style={inp}
                  placeholder={t.university}
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
                <input
                  style={inp}
                  placeholder={t.major}
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
                <input
                  style={inp}
                  placeholder={lang === "ar" ? "رقم الهاتف الجامعي (اختياري)" : "Phone number (optional)"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                />
              </>
            )}
            <input
              style={inp}
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
            <input
              style={inp}
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
            />
            {mode === "signup" && (
              <input
                style={inp}
                type="password"
                placeholder={t.confirmPassword}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                dir="ltr"
              />
            )}
            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#f43f5e18", color: "#f43f5e" }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="gradient-bg glow text-white font-bold py-3 rounded-xl mt-2 hover:opacity-90 active:scale-98 transition-all disabled:opacity-60 shadow-md"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14 }}
            >
              {loading ? "..." : mode === "login" ? t.login : t.signup}
            </button>
          </form>

          {mode === "login" && (
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
              <button
                type="button"
                onClick={() => setShowDev((v) => !v)}
                className="w-full text-xs text-center hover:opacity-80 transition-opacity font-mono"
                style={{ color: "var(--muted-foreground)" }}
              >
                🛠 {t.devHint}
              </button>
              {showDev && (
                <div
                  className="mt-3 p-3 rounded-xl text-xs font-mono shadow-inner"
                  style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                >
                  <div className="flex justify-between mb-1">
                    <span style={{ color: "var(--muted-foreground)" }}>email:</span>
                    <span className="font-bold" style={{ color: "var(--primary)" }}>{devUser.email}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: "var(--muted-foreground)" }}>pass:</span>
                    <span className="font-bold" style={{ color: "var(--primary)" }}>{devUser.password}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(devUser.email);
                      setPassword(devUser.password || "");
                      setError("");
                    }}
                    className="w-full gradient-bg text-white text-xs py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    {lang === "ar" ? "تعبئة تلقائية للحساب" : "Auto-fill demo account"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--muted-foreground)" }}>
          {mode === "login" ? t.noAccount : t.hasAccount}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            className="font-bold hover:underline"
            style={{ color: "var(--primary)" }}
          >
            {mode === "login" ? t.signup : t.login}
          </button>
        </p>
      </div>
    </div>
  );
}
