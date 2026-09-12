import React, { useState } from 'react';
import { Heart, MessageSquare, UserPlus, Repeat2, Bell } from 'lucide-react';

interface NotificationItem {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'repost';
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export const NotificationCenter: React.FC = () => {
  const [notifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: 'like',
      user: 'سارة أحمد',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      text: 'أعجبت بـ منشورك الأخير حول التطوير.',
      time: 'منذ 5 دقائق',
    },
    {
      id: 2,
      type: 'comment',
      user: 'علي الحسين',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      text: 'علق على منشورك: "عمل رائع وممتاز!"',
      time: 'منذ 15 دقيقة',
    },
    {
      id: 3,
      type: 'follow',
      user: 'محمد جاسم',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
      text: 'بدأ بمتابعتك الآن.',
      time: 'منذ ساعة',
    },
  ]);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-pink-500 fill-current" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'repost':
        return <Repeat2 className="w-4 h-4 text-green-600" />;
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Bell className="w-5 h-5 text-blue-500" />
          <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">الإشعارات</h2>
        </div>
        <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-bold">
          {notifications.length} جديدة
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="p-3.5 hover:bg-gray-50 dark:hover:bg-gray-900/50 flex items-start space-x-3 rtl:space-x-reverse transition-colors cursor-pointer"
          >
            <div className="mt-1">{getIcon(item.type)}</div>
            <img
              src={item.avatar}
              alt={item.user}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                <span className="font-bold text-gray-900 dark:text-gray-100">{item.user}</span>{' '}
                {item.text}
              </p>
              <span className="text-[10px] text-gray-400 mt-1 block">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
