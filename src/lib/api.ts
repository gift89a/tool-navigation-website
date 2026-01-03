import type { Category, Tool, ApiResponse, PaginationInfo } from '@/types';

// Use relative URLs in production to avoid CORS issues
const API_BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error',
      }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // 分类相关API
  async getCategories(): Promise<Category[]> {
    const response = await this.request<Category[]>('/categories');
    return response.data;
  }

  async getCategoryTools(
    slug: string,
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    category: Category;
    tools: Tool[];
    pagination: PaginationInfo;
  }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/categories/${slug}/tools${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{
      category: Category;
      tools: Tool[];
    }>(endpoint);
    
    return {
      category: response.data.category,
      tools: response.data.tools,
      pagination: response.pagination!,
    };
  }

  // 工具相关API
  async getTools(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    tags?: string[];
  } = {}): Promise<{
    tools: Tool[];
    pagination: PaginationInfo;
  }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.category) searchParams.set('category', params.category);
    if (params.search) searchParams.set('search', params.search);
    if (params.tags && params.tags.length > 0) {
      searchParams.set('tags', params.tags.join(','));
    }

    const queryString = searchParams.toString();
    const endpoint = `/tools${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<Tool[]>(endpoint);
    
    return {
      tools: response.data,
      pagination: response.pagination!,
    };
  }

  // 搜索相关API
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];
    
    try {
      const searchParams = new URLSearchParams();
      searchParams.set('q', query);
      searchParams.set('limit', '5');

      const response = await this.request<string[]>(`/search/suggestions?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch search suggestions:', error);
      return [];
    }
  }

  async searchTools(params: {
    query: string;
    page?: number;
    limit?: number;
    category?: string;
    tags?: string[];
  }): Promise<{
    tools: Tool[];
    pagination: PaginationInfo;
    query: string;
  }> {
    const searchParams = new URLSearchParams();
    searchParams.set('q', params.query);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.category) searchParams.set('category', params.category);
    if (params.tags && params.tags.length > 0) {
      searchParams.set('tags', params.tags.join(','));
    }

    const queryString = searchParams.toString();
    const endpoint = `/search?${queryString}`;
    
    const response = await this.request<Tool[]>(endpoint);
    
    return {
      tools: response.data,
      pagination: response.pagination!,
      query: params.query,
    };
  }
}

export const apiClient = new ApiClient();