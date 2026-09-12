// ==========================================
// الهياكل البرمجية للهاشتاغات والمستخدمين
// ==========================================

export interface Hashtag {
  id: string;
  tag: string;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  isVerified: boolean;
  bio: string;
  followersCount: number;
  followingCount: number;
}

// 1. القوائم تبدأ فارغة تماماً وتعتمد على مدخلات المستخدمين الحقيقيين
export const hashtagsStore: Hashtag[] = [];
export const usersStore: UserProfile[] = [];

// ==========================================
// 2. منطق استخراج وصناعة الهاشتاغ التلقائي
// ==========================================

// دالة تستخرج أي كلمة تبدأ بـ # من نص المنشور الذي يكتبه المستخدم
export const parseHashtagsFromContent = (text: string): string[] => {
  if (!text) return [];
  const hashtagRegex = /#[^\s!@#$%^&*()=+.\/,\[\]{}?:;'"&#-]+/g;
  const matches = text.match(hashtagRegex);
  
  if (!matches) return [];
  
  // تنظيف الكلمة وإزالة رمز # وتكرار الكلمات
  const tags = matches.map((tag) => tag.replace('#', '').trim());
  return Array.from(new Set(tags));
};

// دالة تسجيل وتحديث الهاشتاغ عند نشر منشور جديد
export const registerPostHashtags = (tags: string[]): Hashtag[] => {
  tags.forEach((tagText) => {
    const existingIndex = hashtagsStore.findIndex(
      (h) => h.tag.toLowerCase() === tagText.toLowerCase()
    );

    if (existingIndex !== -1) {
      // إذا كان الهاشتاغ موجوداً سابقاً، يتم زيادة عداد الاستخدام فقط
      hashtagsStore[existingIndex].postsCount += 1;
      hashtagsStore[existingIndex].updatedAt = new Date();
    } else {
      // إذا كان الهاشتاغ جديداً، يتم إنشاؤه وتخزينه
      hashtagsStore.push({
        id: `ht-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        tag: tagText,
        postsCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });

  return hashtagsStore;
};

// ==========================================
// 3. خوارزمية ترتيب الهاشتاغات الأكثر تداولاً (Trending)
// ==========================================

// تقوم هذه الدالة بترتيب الهاشتاغات تلقائياً حسب الأكثر استخداماً وتكراراً من المستخدمين
export const getDynamicTrendingHashtags = (limit: number = 5): Hashtag[] => {
  return [...hashtagsStore]
    .sort((a, b) => b.postsCount - a.postsCount)
    .slice(0, limit);
};
