import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedPosts: Post[] = data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        writer: post.writer,
        category: post.category,
        subcategory: post.subcategory,
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at)
      }));

      setPosts(formattedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create new post
  const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: post.title,
          content: post.content,
          writer: post.writer,
          category: post.category,
          subcategory: post.subcategory
        })
        .select()
        .single();

      if (error) throw error;

      const newPost: Post = {
        id: data.id,
        title: data.title,
        content: data.content,
        writer: data.writer,
        category: data.category,
        subcategory: data.subcategory,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      throw err;
    }
  };

  // Update existing post
  const updatePost = async (id: string, updates: Partial<Pick<Post, 'title' | 'content' | 'writer'>>) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: updates.title,
          content: updates.content,
          writer: updates.writer
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedPost: Post = {
        id: data.id,
        title: data.title,
        content: data.content,
        writer: data.writer,
        category: data.category,
        subcategory: data.subcategory,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setPosts(prev => prev.map(post => post.id === id ? updatedPost : post));
      return updatedPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      throw err;
    }
  };

  // Delete post
  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      throw err;
    }
  };

  // Subscribe to real-time changes
  useEffect(() => {
    fetchPosts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('posts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'posts' 
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPost: Post = {
              id: payload.new.id,
              title: payload.new.title,
              content: payload.new.content,
              writer: payload.new.writer,
              category: payload.new.category,
              subcategory: payload.new.subcategory,
              createdAt: new Date(payload.new.created_at),
              updatedAt: new Date(payload.new.updated_at)
            };
            setPosts(prev => {
              // Avoid duplicates
              if (prev.some(p => p.id === newPost.id)) return prev;
              return [newPost, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedPost: Post = {
              id: payload.new.id,
              title: payload.new.title,
              content: payload.new.content,
              writer: payload.new.writer,
              category: payload.new.category,
              subcategory: payload.new.subcategory,
              createdAt: new Date(payload.new.created_at),
              updatedAt: new Date(payload.new.updated_at)
            };
            setPosts(prev => prev.map(post => 
              post.id === updatedPost.id ? updatedPost : post
            ));
          } else if (payload.eventType === 'DELETE') {
            setPosts(prev => prev.filter(post => post.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts
  };
};