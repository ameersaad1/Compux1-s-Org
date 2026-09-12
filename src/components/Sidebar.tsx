import React from 'react';
import { Home, Bell, Mail, User, Bookmark, Settings, LogOut, PenSquare } from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'home', onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'messages', label: 'الرسائل', icon: Mail },
    { id: 'bookmarks', label: 'المحفوظات', icon: Bookmark },
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between bg-white dark:bg-black">
      <div className="space-y-6">
        {/* شعار المنصة */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse px-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
            C
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
            Compux
          </span>
        </div>

        {/* قائمة التنقل */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`w-full flex items-center space-x-4 rtl:space-x-reverse px-4 py-3 rounded-xl font-medium text-[15px] transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* زر إنشاء منشور جديد (أسلوب Bluesky) */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all active:scale-[0.98]">
          <PenSquare className="w-5 h-5" />
          <span>نشر جديد</span>
        </button>
      </div>

      {/* البروفايل المصغر في الأسفل */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between px-2">
        <div className="flex items-center space-x-3 rtl:space-x-reverse truncate">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
            alt="المستخدم"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="truncate text-right">
            <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">أمير سعد</p>
            <p className="text-xs text-gray-500 truncate">@ameersaad</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
