import React from 'react';
import { Clock } from 'lucide-react';
import { Post } from '../types';
import { PostCard } from './PostCard';

interface RecentPostsProps {
  posts: Post[];
  onViewPost: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
}

export const RecentPosts: React.FC<RecentPostsProps> = ({
  posts,
  onViewPost,
  onEditPost,
  onDeletePost
}) => {
  const recentPosts = posts
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">최근 업데이트</h2>
      </div>
      
      <div className="space-y-4">
        {recentPosts.length > 0 ? (
          recentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onView={() => onViewPost(post)}
              onEdit={() => onEditPost(post)}
              onDelete={() => onDeletePost(post.id)}
              showActions={false}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
          </p>
        )}
      </div>
    </div>
  );
};