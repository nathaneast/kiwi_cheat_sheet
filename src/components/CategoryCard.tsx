import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  postCount: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  postCount
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 group"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          {category.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {category.subcategories.length}개 하위 카테고리 • {postCount}개 게시글
          </p>
        </div>
        <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};