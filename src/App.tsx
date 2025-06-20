// @ts-nocheck
import React, { useState } from 'react';
// @ts-ignore
import { Plus } from 'lucide-react';
import { Post, ViewType, Category, Subcategory } from './types';
import { categories } from './data/categories';
import { Header } from './components/Header';
import { CategoryCard } from './components/CategoryCard';
import { PostCard } from './components/PostCard';
import { RecentPosts } from './components/RecentPosts';
import { PostEditor } from './components/PostEditor';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { usePosts } from './hooks/usePosts';
import { formatDate } from './utils/date';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { posts, loading, error, createPost, updatePost, deletePost } =
    usePosts();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView("category");
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setCurrentView("subcategory");
  };

  const handlePostClick = (post: Post) => {
    if (currentView === "home") {
      setSelectedCategory(post.category);
      setSelectedSubcategory(post.subcategory);
    }
    setSelectedPost(post);
    setCurrentView("post");
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setCurrentView("create");
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setCurrentView("edit");
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      try {
        await deletePost(postId);
        if (selectedPost?.id === postId) {
          handleBack();
        }
      } catch (err) {
        alert("글 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleSavePost = async (
    title: string,
    content: string,
    writer: string
  ) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, { title, content });
      } else {
        await createPost({
          title,
          content,
          writer,
          category: selectedCategory,
          subcategory: selectedSubcategory,
        });
      }
      setCurrentView("subcategory");
      setEditingPost(null);
    } catch (err) {
      alert("글 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleBack = () => {
    switch (currentView) {
      case "category":
        setCurrentView("home");
        break;
      case "subcategory":
        setCurrentView("category");
        break;
      case "post":
        setCurrentView("subcategory");
        break;
      case "create":
      case "edit":
        setCurrentView("subcategory");
        break;
      default:
        setCurrentView("home");
    }
  };

  const getFilteredPosts = () => {
    let filtered = posts;
    if (selectedCategory && selectedSubcategory) {
      filtered = filtered.filter(
        (p: Post) =>
          p.category === selectedCategory &&
          p.subcategory === selectedSubcategory
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (p: Post) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const getCurrentCategory = () =>
    categories.find((c: Category) => c.id === selectedCategory);
  const getCurrentSubcategory = () =>
    getCurrentCategory()?.subcategories.find(
      (s: Subcategory) => s.id === selectedSubcategory
    );

  const getPostCount = (categoryId: string) => {
    return posts.filter((p: Post) => p.category === categoryId).length;
  };

  const getTitle = () => {
    if (currentView === "post") {
      return "";
    }
    switch (currentView) {
      case "category":
        return getCurrentCategory()?.name || "";
      case "subcategory":
        return `${getCurrentCategory()?.name} > ${
          getCurrentSubcategory()?.name
        }`;
      case "post":
        return selectedPost?.title || "";
      case "create":
        return "새 글 작성";
      case "edit":
        return "글 수정";
      default:
        return "";
    }
  };

  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onBack={handleBack}
        title={getTitle()}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "home" && (
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  카테고리
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category: Category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onClick={() => handleCategoryClick(category.id)}
                      postCount={getPostCount(category.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <RecentPosts
                posts={posts}
                onViewPost={handlePostClick}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
              />
            </div>
          </div>
        )}

        {currentView === "category" && getCurrentCategory() && (
          <div>
            <div className="mb-8">
              {/* <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {getCurrentCategory()?.name}
              </h2> */}
              <p className="text-gray-600">
                {getCurrentCategory()?.subcategories.length}개의 하위 카테고리가
                있습니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCurrentCategory()?.subcategories.map(
                (subcategory: Subcategory) => (
                  <div
                    key={subcategory.id}
                    onClick={() => handleSubcategoryClick(subcategory.id)}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {subcategory.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {
                        posts.filter(
                          (p: Post) =>
                            p.category === selectedCategory &&
                            p.subcategory === subcategory.id
                        ).length
                      }
                      개 게시글
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {currentView === "subcategory" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-gray-600 mt-1">
                  {getFilteredPosts().length}개의 게시글이 있습니다.
                </p>
              </div>
              <button
                onClick={handleCreatePost}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>글 작성</span>
              </button>
            </div>
            <div className="space-y-6">
              {getFilteredPosts().length > 0 ? (
                getFilteredPosts().map((post: Post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onView={() => handlePostClick(post)}
                    onEdit={() => handleEditPost(post)}
                    onDelete={() => handleDeletePost(post.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">아직 게시글이 없습니다.</p>
                  <button
                    onClick={handleCreatePost}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    첫 번째 글 작성하기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {currentView === "post" && selectedPost && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedPost.title}
                  </h1>
                  <div className="flex flex-col text-sm text-gray-600 space-y-1">
                    <div>✏️ {formatDate(selectedPost.createdAt)}</div>
                    <div>✍️: {formatDate(selectedPost.updatedAt)}</div>
                    <div>🙋🏼‍♂️: {selectedPost.writer}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPost(selectedPost)}
                    className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>수정</span>
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {selectedPost.content}
                </div>
              </div>
            </div>
          </div>
        )}
        {(currentView === "create" || currentView === "edit") && (
          <div className="max-w-4xl mx-auto">
            <PostEditor
              post={editingPost}
              categoryName={getCurrentCategory()?.name || ""}
              subcategoryName={getCurrentSubcategory()?.name || ""}
              onSave={handleSavePost}
              onCancel={handleBack}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;