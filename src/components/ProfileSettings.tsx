import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Lock, Smartphone, CheckCircle2 } from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 p-4">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">الأمان والاشتراكات</h2>
        <p className="text-xs text-gray-500 mt-1">إدارة حماية حسابك وشارة التوثيق الذهبية</p>
      </div>

      {/* قسم شارة التوثيق ودعم صناع المحتوى (Stripe) */}
      <div className="p-5 border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 rounded-2xl flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">شارة التوثيق الرسمية</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">احصل على العلامة الزرقاء ودعم أولوية الظهور في البحث.</p>
        </div>
        <button
          onClick={() => setIsVerified(!isVerified)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isVerified
              ? 'bg-green-600 text-white flex items-center space-x-1 rtl:space-x-reverse'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
          }`}
        >
          {isVerified ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>مُوثق</span>
            </>
          ) : (
            'توثيق الحساب'
          )}
        </button>
      </div>

      {/* قسم الأمان والحماية (Two-Factor Authentication) */}
      <div className="p-5 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-4 bg-white dark:bg-black">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">التحقق بخطوتين (2FA)</h4>
              <p className="text-xs text-gray-500">حماية حسابك برمز إضافي عند الدخول</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
          />
        </div>

        <hr className="border-gray-100 dark:border-gray-800" />

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">الجلسات والأجهزة النشطة</h4>
              <p className="text-xs text-gray-500">عرض جميع الأجهزة المسجلة باسمك</p>
            </div>
          </div>
          <button className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            إدارة
          </button>
        </div>
      </div>
    </div>
  );
};
