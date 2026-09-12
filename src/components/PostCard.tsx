import React, { useState } from 'react';
import { Heart, MessageSquare, Repeat2, Share2, MoreHorizontal } from 'lucide-react';
import { CommentSection } from './CommentSection';

interface Author {
  name: string;
  username: string;
  avatarUrl?: string;
}

interface PostData {
  id: number;
  author: Author;
  content: string;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
  repostsCount?: number;
}

// يدعم كلا طريقتي الاستدعاء (إما تمرير post ككائن، أو تمرير الخصائص فرادى)
interface PostCardProps {
  post?: PostData;
  id?: number;
  authorName?: string;
  username?: string;
  avatarUrl?: string;
  content?: string;
  createdAt?: string;
  likesCount?: number;
  commentsCount?: number;
  repostsCount?: number;
}

export const PostCard: React.FC<PostCardProps> = (props) => {
  // توحيد البيانات بغض النظر عن طريقة إرسالها من المكون الأب
  const postId = props.post?.id || props.id || 1;
  const authorName = props.post?.author?.name || props.authorName || 'مستخدم';
  const username = props.post?.author?.username || props.username || 'user';
  const avatarUrl = props.post?.author?.avatarUrl || props.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
  const content = props.post?.content || props.content || '';
  const createdAt = props.post?.createdAt || props.createdAt || 'الآن';
  const initialLikes = props.post?.likesCount || props.likesCount || 0;
  const commentsCount = props.post?.commentsCount || props.commentsCount || 0;
  const repostsCount = props.post?.repostsCount || props.repostsCount || 0;

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="w-full max-w-xl mx-auto border-b border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-colors">
      <div className="flex space-x-3 rtl:space-x-reverse">
        <img 
          src={avatarUrl} 
          alt={authorName} 
          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse truncate">
              <span className="font-bold text-gray-900 dark:text-gray-100 text-[15px] truncate">
                {authorName}
              </span>
              <span className="text-gray-500 text-sm truncate">
                @{username}
              </span>
              <span className="text-gray-400 text-xs">·</span>
              <span className="text-gray-500 text-sm">{createdAt}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-2 text-gray-900 dark:text-gray-100 text-[15px] whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </p>

          <div className="flex items-center justify-between mt-3 text-gray-500 max-w-md">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 rtl:space-x-reverse hover:text-blue-500 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs">{commentsCount}</span>
            </button>

            <button className="flex items-center space-x-2 rtl:space-x-reverse hover:text-green-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-950/30">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{repostsCount}</span>
            </button>

            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 rtl:space-x-reverse transition-colors group ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-950/30">
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs">{likes}</span>
            </button>

            <button className="flex items-center space-x-2 rtl:space-x-reverse hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30">
                <Share2 className="w-4 h-4" />
              </div>
            </button>
          </div>

          {showComments && <CommentSection postId={postId} />}
        </div>
      </div>
    </div>
  );
};
