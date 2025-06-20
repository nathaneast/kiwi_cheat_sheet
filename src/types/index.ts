export interface Post {
  id: string;
  title: string;
  content: string;
  writer: string;
  category: string;
  subcategory: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
}

export type ViewType = 'home' | 'category' | 'subcategory' | 'post' | 'create' | 'edit';