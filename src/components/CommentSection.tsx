import React, { useState } from 'react';
import { Send, CornerDownRight } from 'lucide-react';

interface Comment {
  id: number;
  authorName: string;
  username: string;
  avatarUrl?: string;
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: number;
  initialComments?: Comment[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, initialComments = [] }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      authorName: 'أمير سعد',
      username: 'ameersaad',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      text: newCommentText,
      createdAt: 'الآن',
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/60 space-y-3">
      {/* نموذج كتابة تعليق جديد */}
      <form onSubmit={handleAddComment} className="flex items-center space-x-2 rtl:space-x-reverse">
        <input
          type="text"
          placeholder="اكتب تعليقاً..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          className="flex-1 bg-gray-100 dark:bg-gray-900 border-0 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-all disabled:opacity-50"
          disabled={!newCommentText.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* قائمة التعليقات والمتسلسلات */}
      <div className="space-y-2.5 pl-2 rtl:pr-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-2.5 rtl:space-x-reverse text-sm">
            <CornerDownRight className="w-3.5 h-3.5 text-gray-400 mt-2 shrink-0" />
            <img
              src={comment.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={comment.authorName}
              className="w-7 h-7 rounded-full object-cover mt-0.5"
            />
            <div className="flex-1 bg-gray-50 dark:bg-gray-900/60 p-2.5 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-gray-900 dark:text-gray-200">
                  {comment.authorName}
                </span>
                <span className="text-[11px] text-gray-400">{comment.createdAt}</span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
