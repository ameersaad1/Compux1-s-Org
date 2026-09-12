import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PostCard } from './components/PostCard';
import { Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('home');

  // بيانات تجريبية للمنشورات
  const samplePosts = [
    {
      id: 1,
      authorName: 'علي الحسين',
      username: 'ali_hussain',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      content: 'نعمل حالياً على بناء منصة تواصل جديدة وسريعة جداً باستخدام أفضل التقنيات الحديثة! 🚀',
      createdAt: 'منذ 10 دقائق',
      likesCount: 24,
      commentsCount: 5,
      repostsCount: 2,
    },
    {
      id: 2,
      authorName: 'سارة أحمد',
      username: 'sara_design',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      content: 'تصميم الواجهات مع مكونات Shadcn يعطي جمالية وحداثة لا تُصدق للمشاريع. ما رأيكم؟',
      createdAt: 'منذ ساعة',
      likesCount: 89,
      commentsCount: 12,
      repostsCount: 7,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 flex justify-center">
      <div className="flex w-full max-w-7xl">
        {/* 1. القائمة الجانبية */}
        <Sidebar activeTab={activeTab} onNavigate={(tab) => setActiveTab(tab)} />

        {/* 2. منطقة المحتوى الرئيسية (Feed) */}
        <main className="flex-1 max-w-2xl border-r border-gray-200 dark:border-gray-800 min-h-screen">
          {/* هيدر الصفحة العليا */}
          <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight">الرئيسية</h1>
            <Sparkles className="w-5 h-5 text-blue-500 cursor-pointer" />
          </header>

          {/* قائمة المنشورات */}
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {samplePosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
