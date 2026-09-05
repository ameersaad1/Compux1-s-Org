import React, { useState } from 'react';
import { useApp } from '../../store';
import type { User } from '../../types';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
}

export function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const { updateUser, lang, showToast } = useApp();
  const isRTL = lang === 'ar';

  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [bio, setBio] = useState(user.bio || '');
  const [university, setUniversity] = useState(user.university || '');
  const [faculty, setFaculty] = useState(user.faculty || '');
  const [major, setMajor] = useState(user.major || '');
  const [studyLevel, setStudyLevel] = useState(user.studyLevel || 'Freshman');
  const [phone, setPhone] = useState(user.phone || '');
  const [showPhone, setShowPhone] = useState(user.showPhone || false);
  const [github, setGithub] = useState(user.github || '');
  const [linkedin, setLinkedin] = useState(user.linkedin || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast(isRTL ? 'الاسم لا يمكن أن يكون فارغاً' : 'Name cannot be empty');
      return;
    }

    setSaving(true);
    const updated: User = {
      ...user,
      name: name.trim(),
      handle: handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || user.handle,
      bio: bio.trim(),
      university: university.trim(),
      faculty: faculty.trim(),
      major: major.trim(),
      studyLevel: studyLevel.trim(),
      phone: phone.trim(),
      showPhone,
      github: github.trim(),
      linkedin: linkedin.trim(),
    };

    try {
      await updateUser(updated);
      onClose();
    } catch {
      showToast(isRTL ? 'حدث خطأ أثناء التحديث' : 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" dir={isRTL ? 'rtl' : 'ltr'}>
      <div 
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass p-6 sm:p-7 shadow-2xl border transition-all"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between pb-4 mb-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-xl font-extrabold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {isRTL ? 'تعديل الملف الشخصي الأكاديمي' : 'Edit Academic Profile'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isRTL ? 'تحديث وتطهير بياناتك وحفظها في قاعدة البيانات' : 'Update and sanitize your public campus profile'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted text-sm font-bold transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
          {/* Full Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-foreground">
                {isRTL ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-foreground">
                {isRTL ? 'المعرّف الجامعي (@handle)' : 'Username (@handle)'}
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                maxLength={30}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block font-semibold mb-1 text-foreground">
              {isRTL ? 'النبذة التعريفية (Bio)' : 'Bio'}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={400}
              rows={3}
              placeholder={isRTL ? 'اكتب نبذة عن اهتماماتك الأكاديمية والتقنية...' : 'Brief description of your academic interests...'}
              className="w-full px-3.5 py-2 rounded-xl border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          {/* Academic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-foreground">
                {isRTL ? 'الجامعة' : 'University'}
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                maxLength={100}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-foreground">
                {isRTL ? 'الكلية' : 'Faculty / College'}
              </label>
              <input
                type="text"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                maxLength={100}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-foreground">
                {isRTL ? 'التخصص' : 'Major'}
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                maxLength={100}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-foreground">
                {isRTL ? 'المرحلة الدراسية' : 'Study Level'}
              </label>
              <select
                value={studyLevel}
                onChange={(e) => setStudyLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                style={{ borderColor: 'var(--border)' }}
              >
                <option value="Freshman">{isRTL ? 'مرحلة أولى (Freshman)' : 'Freshman'}</option>
                <option value="Sophomore">{isRTL ? 'مرحلة ثانية (Sophomore)' : 'Sophomore'}</option>
                <option value="Junior">{isRTL ? 'مرحلة ثالثة (Junior)' : 'Junior'}</option>
                <option value="Senior">{isRTL ? 'مرحلة رابعة (Senior)' : 'Senior'}</option>
                <option value="Graduate">{isRTL ? 'دراسات عليا (Graduate)' : 'Graduate'}</option>
              </select>
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-foreground">
                GitHub Link
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-foreground">
                LinkedIn Link
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          </div>

          {/* Phone & Visibility */}
          <div className="p-3.5 rounded-2xl border" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-bold text-foreground">{isRTL ? 'رقم الهاتف الجامعي' : 'Campus Phone Number'}</p>
                <p className="text-xs text-muted-foreground">{phone || (isRTL ? 'غير محدد' : 'Not specified')}</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={showPhone}
                  onChange={(e) => setShowPhone(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>{isRTL ? 'إظهار للزملاء في الحرم' : 'Show publicly'}</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 mt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold border hover:bg-muted text-foreground transition-all"
              style={{ borderColor: 'var(--border)' }}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="gradient-bg px-6 py-2.5 rounded-xl font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? (isRTL ? 'جارٍ الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التعديلات' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
