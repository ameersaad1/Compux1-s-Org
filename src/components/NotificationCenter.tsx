import React from 'react';
import { Heart, MessageSquare, UserPlus, Repeat2, Bell } from 'lucide-react';

// تعريف نوع البيانات العام للإشعار
export interface NotificationItem {
  id: string | number;
  type: 'like' | 'comment' | 'follow' | 'repost';
  user: {
    name: string;
    username: string;
    avatarUrl?: string;
  };
  text: string;
  createdAt: string;
  isRead?: boolean;
}

// خصائص المكون العامة
interface NotificationCenterProps {
  notifications?: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAllAsRead?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = [],
  onNotificationClick,
  onMarkAllAsRead,
}) => {
  // دالة إرجاع الأيقونة المناسبة حسب نوع الإشعار
  const getNotificationIcon = (type: NotificationItem['type']) => {
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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="w-full max-w-md bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      {/* رأس مركز الإشعارات */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Bell className="w-5 h-5 text-blue-500" />
          <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">الإشعارات</h2>
        </div>
        
        {unreadCount > 0 && (
          <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-bold">
            {unreadCount} غير قراءة
          </span>
        )}
      </div>

      {/* قائمة الإشعارات الديناميكية */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => onNotificationClick && onNotificationClick(item)}
              className={`p-3.5 flex items-start space-x-3 rtl:space-x-reverse transition-colors cursor-pointer ${
                item.isRead
                  ? 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                  : 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40'
              }`}
            >
              <div className="mt-1 shrink-0">{getNotificationIcon(item.type)}</div>
              <img
                src={
                  item.user.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                }
                alt={item.user.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {item.user.name}
                  </span>{' '}
                  <span className="text-gray-500 text-[11px]">@{item.user.username}</span>{' '}
                  {item.text}
                </p>
                <span className="text-[10px] text-gray-400 mt-1 block">{item.createdAt}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">
            لا توجد إشعارات حتى الآن.
          </div>
        )}
      </div>
    </div>
  );
};
