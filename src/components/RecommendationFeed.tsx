import React from 'react';
import { Sparkles, TrendingUp, UserPlus } from 'lucide-react';

export const RecommendationFeed: React.FC = () => {
  const suggestedUsers = [
    { name: 'د. خالد العمري', username: 'khaled_omari', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { name: 'فاطمة العلي', username: 'fatima_tech', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  ];

  const trendingHashtags = [
    { tag: '#الذكاء_الاصطناعي', posts: '12.4 ألف منشور' },
    { tag: '#تطوير_الويب', posts: '8.1 ألف منشور' },
  ];

  return (
    <div className="w-full max-w-xs space-y-4">
      {/* حسابات مقترحة لمتابعتها */}
      <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800">
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">مقترح لك</h3>
        </div>
        <div className="space-y-3">
          {suggestedUsers.map((u, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse truncate">
                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="truncate text-right">
                  <p className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate">{u.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">@{u.username}</p>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-xl text-xs font-semibold transition-all">
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* الهاشتاغات المتداولة */}
      <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800">
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">الأكثر تداولاً</h3>
        </div>
        <div className="space-y-2.5">
          {trendingHashtags.map((h, i) => (
            <div key={i} className="cursor-pointer hover:opacity-80">
              <p className="font-bold text-xs text-blue-600 dark:text-blue-400">{h.tag}</p>
              <p className="text-[10px] text-gray-400">{h.posts}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
