import React, { useState, useRef, useEffect } from 'react';
import { useApp } from "../../store";

const COUNTRY_CODES = [
  { code: "+964", flag: "🇮🇶", name: "العراق (Iraq)" },
  { code: "+966", flag: "🇸🇦", name: "السعودية (Saudi Arabia)" },
  { code: "+971", flag: "🇦🇪", name: "الإمارات (UAE)" },
  { code: "+974", flag: "🇶🇦", name: "قطر (Qatar)" },
  { code: "+965", flag: "🇰🇼", name: "الكويت (Kuwait)" },
  { code: "+973", flag: "🇧🇭", name: "البحرين (Bahrain)" },
  { code: "+968", flag: "🇴🇲", name: "عمان (Oman)" },
  { code: "+962", flag: "🇯🇴", name: "الأردن (Jordan)" },
  { code: "+961", flag: "🇱🇧", name: "لبنان (Lebanon)" },
  { code: "+20", flag: "🇪🇬", name: "مصر (Egypt)" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
];

export function OTPModal({ onClose }: { onClose: () => void }) {
  const { currentUser, verifyPhone, lang } = useApp();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "otp") {
      setCountdown(60);
      setCanResend(false);
      const iv = setInterval(() => {
        setCountdown((v) => {
          if (v <= 1) {
            clearInterval(iv);
            setCanResend(true);
            return 0;
          }
          return v - 1;
        });
      }, 1000);
      return () => clearInterval(iv);
    }
  }, [step]);

  function handleSendOTP() {
    if (!phone.trim()) {
      setError(lang === "ar" ? "يرجى إدخال رقم هاتفك المحمول" : "Please enter your phone number");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setError("");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }, 800);
  }

  function handleOtpChange(idx: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  }

  function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) {
      setError(lang === "ar" ? "يرجى إدخال جميع أرقام الرمز الـ 6" : "Please enter all 6 digits");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (currentUser) {
        verifyPhone(currentUser.id, `${countryCode.code} ${phone}`);
      }
      onClose();
    }, 900);
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
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
        style={{ border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-extrabold text-lg" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
              {step === "phone"
                ? (lang === "ar" ? "📱 توثيق رقم الهاتف" : "📱 Phone Verification")
                : (lang === "ar" ? "🔐 أدخل رمز التحقق OTP" : "🔐 Enter OTP")}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}>
              {step === "phone"
                ? (lang === "ar" ? "أضف رقمك لتأمين حسابك وتفعيل الإشعارات" : "Add and verify your mobile number")
                : (lang === "ar" ? `تم إرسال الرمز إلى ${countryCode.code} ${phone}` : `Code sent to ${countryCode.code} ${phone}`)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-75 transition-opacity"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            ✕
          </button>
        </div>

        {step === "phone" ? (
          <div className="flex flex-col gap-3">
            {/* Country selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryList((v) => !v)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm justify-between"
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{countryCode.flag}</span>
                  <span className="text-xs font-semibold">{countryCode.code}</span>
                  <span className="text-xs truncate max-w-[150px]">{countryCode.name}</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {showCountryList && (
                <div
                  className="absolute z-10 w-full mt-1 rounded-xl overflow-auto shadow-2xl border"
                  style={{
                    background: "var(--background)",
                    borderColor: "var(--border)",
                    maxHeight: 200,
                  }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <button
                      key={c.code + c.name}
                      type="button"
                      onClick={() => {
                        setCountryCode(c);
                        setShowCountryList(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-xs text-start transition-all hover:opacity-80"
                      style={{ color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
                    >
                      <span className="text-base">{c.flag}</span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="font-mono" style={{ color: "var(--muted-foreground)" }}>{c.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              style={inp}
              type="tel"
              placeholder="770 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
              dir="ltr"
              className="font-mono text-left"
            />
            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#f43f5e18", color: "#f43f5e" }}>
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={loading}
              className="gradient-bg glow text-white font-bold py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-60 active:scale-98"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14 }}
            >
              {loading
                ? (lang === "ar" ? "جارٍ الإرسال..." : "Sending...")
                : (lang === "ar" ? "إرسال رمز التحقق" : "Send Verification Code")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* 6-digit OTP input */}
            <div className="flex gap-2 justify-center" dir="ltr">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[i] && i > 0) {
                      otpRefs.current[i - 1]?.focus();
                    }
                  }}
                  className="w-10 h-12 text-center text-lg font-bold rounded-xl outline-none transition-all shadow-xs"
                  style={{
                    background: digit ? "rgba(109,94,245,0.15)" : "var(--muted)",
                    border: digit ? "2px solid var(--primary)" : "1px solid var(--border)",
                    color: "var(--foreground)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                />
              ))}
            </div>

            {/* Countdown */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={() => {
                    setOtp(["", "", "", "", "", ""]);
                    setStep("phone");
                  }}
                  className="text-xs font-semibold hover:underline"
                  style={{ color: "var(--primary)", fontFamily: "'Outfit', sans-serif" }}
                >
                  {lang === "ar" ? "إعادة إرسال الرمز" : "Resend Code"}
                </button>
              ) : (
                <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                  {lang === "ar" ? "إعادة الإرسال خلال " : "Resend in "}
                  <span style={{ color: "var(--primary)" }}>{countdown}s</span>
                </p>
              )}
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg text-center" style={{ background: "#f43f5e18", color: "#f43f5e" }}>
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || otp.join("").length < 6}
              className="gradient-bg glow text-white font-bold py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 active:scale-98"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14 }}
            >
              {loading
                ? (lang === "ar" ? "جارٍ التحقق..." : "Verifying...")
                : (lang === "ar" ? "تأكيد الرقم" : "Verify Number")}
            </button>
            <p className="text-[11px] text-center" style={{ color: "var(--muted-foreground)" }}>
              {lang === "ar" ? "أي رمز مكوّن من 6 أرقام سيعمل في هذه النسخة التجريبية" : "Any 6-digit code works in this demo"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
