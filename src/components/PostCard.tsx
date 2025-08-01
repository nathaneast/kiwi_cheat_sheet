import React from 'react';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { Post } from '../types';
import { formatDate } from '../utils/date';
import { categories } from "../data/categories";

interface PostCardProps {
  post: Post;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showActions?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  // 카테고리/서브카테고리 이름 찾기
  const category = categories.find((c) => c.id === post.category);
  const subcategory = category?.subcategories.find(
    (s) => s.id === post.subcategory
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* 최근 업데이트 카드일 때 카테고리 > 서브카테고리 표시 */}
      {!showActions && category && subcategory && (
        <div className="mb-2 text-xs text-gray-700 font-medium">
          {category.name} &gt; {subcategory.name}
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <h3
          onClick={onView}
          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors flex-1 mr-4"
        >
          {post.title}
        </h3>
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              title="수정"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="삭제"
            >
              <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {post.content.slice(0, 150)}...
      </p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>{formatDate(post.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};