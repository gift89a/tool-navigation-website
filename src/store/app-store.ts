import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tool, Category, User } from '@/types';
import { detectUserLocale, saveLocalePreference, updateUrlLocale, type SupportedLocale } from '@/lib/i18n';

interface AppState {
  // 用户状态
  user: User | null;
  theme: 'light' | 'dark';
  locale: SupportedLocale;
  
  // 工具状态
  tools: Tool[];
  categories: Category[];
  favorites: string[];
  searchQuery: string;
  selectedCategory: string | null;
  
  // UI 状态
  isLoading: boolean;
  searchSuggestions: string[];
  
  // 语言切换状态
  isLocaleInitialized: boolean;
  
  // 操作方法
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLocale: (locale: SupportedLocale, updateUrl?: boolean) => void;
  initializeLocale: () => void;
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setTools: (tools: Tool[]) => void;
  setCategories: (categories: Category[]) => void;
  setIsLoading: (loading: boolean) => void;
  setSearchSuggestions: (suggestions: string[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      theme: 'light',
      locale: 'zh',
      tools: [],
      categories: [],
      favorites: [],
      searchQuery: '',
      selectedCategory: null,
      isLoading: false,
      searchSuggestions: [],
      isLocaleInitialized: false,

      // 操作方法
      setUser: (user) => set({ user }),
      
      setTheme: (theme) => {
        set({ theme });
        // 更新HTML类名
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
      
      setLocale: (locale, updateUrl = true) => {
        set({ locale });
        
        // 保存到 localStorage
        saveLocalePreference(locale);
        
        // 更新 URL 参数
        if (updateUrl) {
          updateUrlLocale(locale);
        }
        
        // 更新 HTML lang 属性
        if (typeof window !== 'undefined') {
          document.documentElement.lang = locale;
        }
      },
      
      initializeLocale: () => {
        if (get().isLocaleInitialized) return;
        
        const detectedLocale = detectUserLocale();
        const currentLocale = get().locale;
        
        // 如果检测到的语言与当前语言不同，则更新
        if (detectedLocale !== currentLocale) {
          get().setLocale(detectedLocale, false); // 不更新URL，避免初始化时修改URL
        }
        
        // 设置 HTML lang 属性
        if (typeof window !== 'undefined') {
          document.documentElement.lang = get().locale;
        }
        
        set({ isLocaleInitialized: true });
      },
      
      addFavorite: (toolId) => {
        const { favorites } = get();
        if (!favorites.includes(toolId)) {
          set({ favorites: [...favorites, toolId] });
        }
      },
      
      removeFavorite: (toolId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(id => id !== toolId) });
      },
      
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setTools: (tools) => set({ tools }),
      setCategories: (categories) => set({ categories }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setSearchSuggestions: (searchSuggestions) => set({ searchSuggestions }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
        favorites: state.favorites,
        user: state.user,
      }),
    }
  )
);