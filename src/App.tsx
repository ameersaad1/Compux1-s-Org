import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PostCard } from './components/PostCard';
import { SearchBar } from './components/SearchBar';
import { NotificationCenter } from './components/NotificationCenter';
import { DirectMessages } from './components/DirectMessages';
import { ProfileSettings } from './components/ProfileSettings';
import { RecommendationFeed } from './components/RecommendationFeed';
import { ImageUploader } from './components/ImageUploader';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface Post {
  id: string | number;
  author: UserProfile;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
}

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    // جلب بيانات الجلسة الحقيقية للمستخدم عند تسجيل الدخول
    const fetchUserData = async () => {
      // سيتم ربطها بـ Supabase Auth للحصول على بيانات الحساب الفعلي
      const loggedInUser: UserProfile = {
        id: 'user_123',
        name: 'المستخدم الحالي',
        username: 'user_handle',
        avatarUrl: '',
      };
      setCurrentUser(loggedInUser);
    };

    fetchUserData();
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !currentUser) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
      },
      content: newPostContent,
      imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
      createdAt: 'الآن',
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 flex justify-center">
      <div className="flex w-full max-w-7xl">
        <Sidebar activeTab={activeTab} onNavigate={(tab) => setActiveTab(tab)} />

        <main className="flex-1 max-w-2xl border-r border-gray-200 dark:border-gray-800 min-h-screen">
          <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-3.5 flex items-center justify-between gap-4">
            <h1 className="text-lg font-bold tracking-tight capitalize">{activeTab}</h1>
            <SearchBar />
          </header>

          {activeTab === 'home' && (
            <div>
              {currentUser ? (
                <form onSubmit={handleCreatePost} className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-3">
                  <div className="flex space-x-3 rtl:space-x-reverse">
                    <img
                      src={currentUser.avatarUrl || 'https://via.placeholder.com/150'}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <textarea
                      placeholder={`ماذا يدور في ذهنك يا ${currentUser.name}؟`}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="w-full bg-transparent border-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none resize-none text-base"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                    <ImageUploader onImageSelect={(file) => setSelectedImage(file)} />
                    <button
                      type="submit"
                      disabled={!newPostContent.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all disabled:opacity-50"
                    >
                      نشر
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 text-center text-sm text-gray-500">
                  يرجى تسجيل الدخول للتمكن من النشر والتفاعل.
                </div>
              )}

              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={Number(post.id)}
                      authorName={post.author.name}
                      username={post.author.username}
                      avatarUrl={post.author.avatarUrl}
                      content={post.content}
                      createdAt={post.createdAt}
                      likesCount={post.likesCount}
                      commentsCount={post.commentsCount}
                      repostsCount={post.repostsCount}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500 text-sm">
                    لا توجد منشورات حتى الآن. كن أول من ينشر!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="p-4">
              <DirectMessages />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-4 flex justify-center">
              <NotificationCenter />
            </div>
          )}

          {activeTab === 'settings' && <ProfileSettings />}
        </main>

        <aside className="hidden lg:block w-80 p-4 space-y-6">
          <RecommendationFeed />
        </aside>
      </div>
    </div>
  );
}

export default App;
