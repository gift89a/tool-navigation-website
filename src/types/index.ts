export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  url: string;
  category: Category;
  categoryId: string;
  tags: Tag[];
  rating: number;
  usageCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  slug: string;
  isActive: boolean;
  tools?: Tool[];
  toolCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  tools?: Tool[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  locale: string;
  theme: string;
  createdAt: Date;
  favorites?: UserFavorite[];
}

export interface UserFavorite {
  id: string;
  userId: string;
  toolId: string;
  user: User;
  tool: Tool;
}

export interface ToolAnalytics {
  id: string;
  toolId: string;
  clicks: number;
  views: number;
  date: Date;
  tool: Tool;
}

export interface AdSlot {
  id: string;
  name: string;
  position: string;
  content?: string;
  isActive: boolean;
}

export interface SearchParams {
  q?: string;
  category?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}