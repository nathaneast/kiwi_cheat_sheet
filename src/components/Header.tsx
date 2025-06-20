import React from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onBack: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  searchTerm,
  setSearchTerm,
  onBack,
  title
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {currentView !== "home" && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {currentView === "home" ? "키위족보" : title}
              </h1>
              {currentView === "home" && (
                <p className="text-sm text-gray-600">
                  함께 만들어가는 실시간 정보 공유 뉴질랜드 워킹홀리데이 위키
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="정보 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};