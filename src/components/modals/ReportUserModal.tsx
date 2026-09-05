import React, { useState } from 'react';
import { useApp } from '../../store';
import type { User } from '../../types';

interface ReportUserModalProps {
  targetUser: User;
  onClose: () => void;
}

export function ReportUserModal({ targetUser, onClose }: ReportUserModalProps) {
  const { reportUser, lang } = useApp();
  const isRTL = lang === 'ar';
  const [reason, setReason] = useState('محتوى غير لائق أو مخالف لمعايير الحرم الجامعي');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reasons = isRTL
    ? [
        'محتوى غير لائق أو مخالف لمعايير الحرم الجامعي',
        'انتحال شخصية طالب أو جهة أكاديمية',
        'إزعاج ومضايقات أو رسائل غير مرغوبة (Spam)',
        'نشر معلومات مضللة أو اختبارات مسربة',
        'سبب أمني أو انتهاك شروط الاستخدام'
      ]
    : [
        'Inappropriate content or community guidelines violation',
        'Impersonating another student or faculty member',
        'Harassment, abusive behavior, or spam',
        'Academic dishonesty or leaked exam materials',
        'Security concern or terms of service violation'
      ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const finalReason = details.trim() ? `${reason} - ${details.trim()}` : reason;
    await reportUser(targetUser.id, finalReason);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" dir={isRTL ? 'rtl' : 'ltr'}>
      <div 
        className="w-full max-w-md rounded-3xl glass p-6 shadow-2xl border transition-all"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 text-rose-500">
            <span className="text-xl">⚠️</span>
            <h3 className="font-extrabold text-base sm:text-lg text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {isRTL ? `إبلاغ عن حساب @${targetUser.handle}` : `Report Account @${targetUser.handle}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {isRTL 
            ? 'تلتزم منصة Compux بالحفاظ على بيئة جامعية آمنة وأخلاقية. سيتم إرسال بلاغك مباشرة لفريق الأمن الأكاديمي للتحقق.'
            : 'Compux is dedicated to maintaining a safe academic environment. Your report will be immediately audited by safety admins.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold mb-1.5 text-foreground">
              {isRTL ? 'حدد سبب البلاغ' : 'Select Reason'}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-rose-500 text-xs sm:text-sm"
              style={{ borderColor: 'var(--border)' }}
            >
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1.5 text-foreground">
              {isRTL ? 'تفاصيل إضافية (اختياري)' : 'Additional Context (Optional)'}
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder={isRTL ? 'أضف أي تفاصيل توضيحية تدعم البلاغ...' : 'Provide any additional details...'}
              className="w-full px-3 py-2 rounded-xl border bg-background text-foreground resize-none text-xs focus:ring-2 focus:ring-rose-500"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 mt-1 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold border hover:bg-muted text-foreground text-xs"
              style={{ borderColor: 'var(--border)' }}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all text-xs disabled:opacity-50"
            >
              {submitting ? (isRTL ? 'جارٍ الإرسال...' : 'Submitting...') : (isRTL ? 'إرسال البلاغ' : 'Submit Report')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
