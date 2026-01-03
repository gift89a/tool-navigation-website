import { useAppStore } from '@/store/app-store';

// 翻译字典
const translations = {
  zh: {
    // 通用
    'common.search': '搜索',
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.retry': '重试',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.add': '添加',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    
    // 导航
    'nav.home': '首页',
    'nav.categories': '分类',
    'nav.favorites': '收藏',
    'nav.about': '关于',
    'nav.contact': '联系',
    
    // 搜索
    'search.placeholder': '搜索工具...',
    'search.noResults': '没有找到相关工具',
    'search.suggestions': '搜索建议',
    'search.history': '搜索历史',
    
    // 工具
    'tool.rating': '评分',
    'tool.usage': '使用次数',
    'tool.favorite': '收藏',
    'tool.unfavorite': '取消收藏',
    'tool.share': '分享',
    'tool.report': '举报',
    
    // 分类
    'category.tools': '个工具',
    'category.all': '全部分类',
    
    // 主题
    'theme.light': '浅色模式',
    'theme.dark': '深色模式',
    'theme.toggle': '切换主题',
    
    // 语言
    'language.zh': '中文',
    'language.en': 'English',
    'language.toggle': '切换语言',
    
    // 页面标题
    'page.home.title': '工具导航 - 在线工具集合平台',
    'page.home.description': '一个现代化的在线工具导航平台，提供各类实用工具的分类导航和在线使用功能',
    'page.favorites.title': '我的收藏',
    'page.category.title': '分类工具',
    
    // 错误页面
    'error.404.title': '页面未找到',
    'error.404.description': '抱歉，您访问的页面不存在',
    'error.500.title': '服务器错误',
    'error.500.description': '服务器出现了一些问题，请稍后再试',
  },
  en: {
    // 通用
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    
    // 导航
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.favorites': 'Favorites',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // 搜索
    'search.placeholder': 'Search tools...',
    'search.noResults': 'No tools found',
    'search.suggestions': 'Suggestions',
    'search.history': 'Search History',
    
    // 工具
    'tool.rating': 'Rating',
    'tool.usage': 'Usage',
    'tool.favorite': 'Favorite',
    'tool.unfavorite': 'Unfavorite',
    'tool.share': 'Share',
    'tool.report': 'Report',
    
    // 分类
    'category.tools': ' tools',
    'category.all': 'All Categories',
    
    // 主题
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    'theme.toggle': 'Toggle Theme',
    
    // 语言
    'language.zh': '中文',
    'language.en': 'English',
    'language.toggle': 'Toggle Language',
    
    // 页面标题
    'page.home.title': 'Tool Navigator - Online Tools Platform',
    'page.home.description': 'A modern online tool navigation platform providing categorized navigation and online usage of various practical tools',
    'page.favorites.title': 'My Favorites',
    'page.category.title': 'Category Tools',
    
    // 错误页面
    'error.404.title': 'Page Not Found',
    'error.404.description': 'Sorry, the page you are looking for does not exist',
    'error.500.title': 'Server Error',
    'error.500.description': 'The server encountered an error, please try again later',
  },
};

export function useTranslations() {
  const locale = useAppStore((state) => state.locale);
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        // 如果找不到翻译，返回key本身
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  return { t, locale };
}