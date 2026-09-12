import React, { useState } from 'react';
import { Heart, MessageSquare, Repeat2, Share2, MoreHorizontal } from 'lucide-react';

interface PostCardProps {
  authorName: string;
  username: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
}

export const PostCard: React.FC<PostCardProps> = ({
  authorName,
  username,
  avatarUrl,
  content,
  createdAt,
  likesCount: initialLikes,
  commentsCount,
  repostsCount,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="w-full max-w-xl mx-auto border-b border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-colors">
      <div className="flex space-x-3 rtl:space-x-reverse">
        {/* الصورة الشخصية */}
        <img
          src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />

        {/* محتوى المنشور */}
        <div className="flex-1 min-w-0">
          {/* معلومات الكاتب والوقت */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse truncate">
              <span className="font-bold text-gray-900 dark:text-gray-100 text-[15px] truncate">
                {authorName}
              </span>
              <span className="text-gray-500 text-sm truncate">@{username}</span>
              <span className="text-gray-400 text-xs">·</span>
              <span className="text-gray-500 text-sm">{createdAt}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* نص المنشور */}
          <p className="mt-1.5 text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed break-words dir-auto">
            {content}
          </p>

          {/* شريط أزرار التفاعل مستوحى من Bluesky و Shadcn */}
          <div className="flex justify-between items-center mt-3 max-w-md text-gray-500 text-sm">
            {/* التعليقات */}
            <button className="flex items-center space-x-1.5 rtl:space-x-reverse hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs">{commentsCount}</span>
            </button>

            {/* إعادة النشر */}
            <button className="flex items-center space-x-1.5 rtl:space-x-reverse hover:text-green-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-950/40">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{repostsCount}</span>
            </button>

            {/* الإعجاب */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse transition-colors group ${
                isLiked ? 'text-pink-600' : 'hover:text-pink-500'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-950/40">
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs">{likes}</span>
            </button>

            {/* المشاركة */}
            <button className="flex items-center space-x-1.5 rtl:space-x-reverse hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40">
                <Share2 className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
