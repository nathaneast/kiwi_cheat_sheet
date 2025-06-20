import { Post } from '../types';

const STORAGE_KEY = 'nz-wiki-posts';

export const savePosts = (posts: Post[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const loadPosts = (): Post[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsedPosts = JSON.parse(saved);
    return parsedPosts.map((post: any) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt)
    }));
  }
  return [];
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};