/**
 * 模拟数据 - 用于本地开发和演示
 */

import type { Tool, Category, Tag } from '@/types';

// 模拟标签数据
export const mockTags: Tag[] = [
  { id: '1', name: '在线工具', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: '免费', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: '开源', createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: '编程', createdAt: new Date(), updatedAt: new Date() },
  { id: '5', name: '设计', createdAt: new Date(), updatedAt: new Date() },
  { id: '6', name: '效率', createdAt: new Date(), updatedAt: new Date() },
  { id: '7', name: '协作', createdAt: new Date(), updatedAt: new Date() },
  { id: '8', name: 'API', createdAt: new Date(), updatedAt: new Date() },
];

// 模拟分类数据
export const mockCategories: Category[] = [
  {
    id: '1',
    name: '开发工具',
    slug: 'development',
    description: '编程开发相关的实用工具',
    icon: '💻',
    color: '#3B82F6',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: '设计工具',
    slug: 'design',
    description: 'UI/UX设计和图形处理工具',
    icon: '🎨',
    color: '#EF4444',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: '效率工具',
    slug: 'productivity',
    description: '提升工作效率的各类工具',
    icon: '⚡',
    color: '#10B981',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: '文档工具',
    slug: 'documentation',
    description: '文档编写和管理工具',
    icon: '📝',
    color: '#F59E0B',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: '测试工具',
    slug: 'testing',
    description: '软件测试和质量保证工具',
    icon: '🧪',
    color: '#8B5CF6',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: '数据工具',
    slug: 'data',
    description: '数据处理和分析工具',
    icon: '📊',
    color: '#06B6D4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 模拟工具数据
export const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Visual Studio Code',
    slug: 'vscode',
    description: '微软开发的免费代码编辑器，支持多种编程语言和丰富的插件生态',
    url: 'https://code.visualstudio.com',
    icon: '🔷',
    rating: 4.8,
    usageCount: 15420,
    isActive: true,
    isFeatured: true,
    categoryId: '1',
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[1], mockTags[3]],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Figma',
    slug: 'figma',
    description: '基于浏览器的协作式界面设计工具，支持实时协作和原型制作',
    url: 'https://figma.com',
    icon: '🎨',
    rating: 4.7,
    usageCount: 12800,
    isActive: true,
    isFeatured: true,
    categoryId: '2',
    category: mockCategories[1],
    tags: [mockTags[0], mockTags[4], mockTags[6]],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Notion',
    slug: 'notion',
    description: '集笔记、任务管理、数据库于一体的全能工作空间',
    url: 'https://notion.so',
    icon: '📝',
    rating: 4.6,
    usageCount: 9500,
    isActive: true,
    isFeatured: false,
    categoryId: '3',
    category: mockCategories[2],
    tags: [mockTags[0], mockTags[5], mockTags[6]],
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    name: 'GitHub',
    slug: 'github',
    description: '全球最大的代码托管平台，支持版本控制和协作开发',
    url: 'https://github.com',
    icon: '🐙',
    rating: 4.9,
    usageCount: 18900,
    isActive: true,
    isFeatured: true,
    categoryId: '1',
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[3], mockTags[6]],
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '5',
    name: 'Postman',
    slug: 'postman',
    description: 'API 开发和测试的完整平台，支持请求构建、测试和文档生成',
    url: 'https://postman.com',
    icon: '📮',
    rating: 4.5,
    usageCount: 7200,
    isActive: true,
    isFeatured: false,
    categoryId: '5',
    category: mockCategories[4],
    tags: [mockTags[0], mockTags[3], mockTags[7]],
    createdAt: new Date('2023-04-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '6',
    name: 'Canva',
    slug: 'canva',
    description: '简单易用的在线设计工具，提供丰富的模板和设计元素',
    url: 'https://canva.com',
    icon: '🌈',
    rating: 4.4,
    usageCount: 11300,
    isActive: true,
    isFeatured: false,
    categoryId: '2',
    category: mockCategories[1],
    tags: [mockTags[0], mockTags[4], mockTags[1]],
    createdAt: new Date('2023-02-28'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: '7',
    name: 'Trello',
    slug: 'trello',
    description: '基于看板的项目管理工具，简单直观的任务组织方式',
    url: 'https://trello.com',
    icon: '📋',
    rating: 4.3,
    usageCount: 8600,
    isActive: true,
    isFeatured: false,
    categoryId: '3',
    category: mockCategories[2],
    tags: [mockTags[0], mockTags[5], mockTags[6]],
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '8',
    name: 'GitBook',
    slug: 'gitbook',
    description: '现代化的文档编写和发布平台，支持团队协作',
    url: 'https://gitbook.com',
    icon: '📚',
    rating: 4.2,
    usageCount: 5400,
    isActive: true,
    isFeatured: false,
    categoryId: '4',
    category: mockCategories[3],
    tags: [mockTags[0], mockTags[4], mockTags[6]],
    createdAt: new Date('2023-05-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '9',
    name: 'Tableau',
    slug: 'tableau',
    description: '强大的数据可视化和商业智能平台',
    url: 'https://tableau.com',
    icon: '📈',
    rating: 4.1,
    usageCount: 6800,
    isActive: true,
    isFeatured: false,
    categoryId: '6',
    category: mockCategories[5],
    tags: [mockTags[0], mockTags[5]],
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '10',
    name: 'Jest',
    slug: 'jest',
    description: 'JavaScript 测试框架，专注于简洁性和易用性',
    url: 'https://jestjs.io',
    icon: '🃏',
    rating: 4.6,
    usageCount: 4200,
    isActive: true,
    isFeatured: false,
    categoryId: '5',
    category: mockCategories[4],
    tags: [mockTags[2], mockTags[3]],
    createdAt: new Date('2023-07-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

// 工具函数
export function getMockCategories(): Category[] {
  return mockCategories;
}

export function getMockTools(categoryId?: string, limit?: number): Tool[] {
  let tools = mockTools;
  
  if (categoryId) {
    tools = tools.filter(tool => tool.categoryId === categoryId);
  }
  
  if (limit) {
    tools = tools.slice(0, limit);
  }
  
  return tools;
}

export function getMockToolById(id: string): Tool | null {
  return mockTools.find(tool => tool.id === id) || null;
}

export function getMockToolBySlug(slug: string): Tool | null {
  return mockTools.find(tool => tool.slug === slug) || null;
}

export function getMockCategoryBySlug(slug: string): Category | null {
  return mockCategories.find(category => category.slug === slug) || null;
}

export function searchMockTools(query: string): Tool[] {
  const lowercaseQuery = query.toLowerCase();
  return mockTools.filter(tool => 
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.tags.some(tag => tag.name.toLowerCase().includes(lowercaseQuery))
  );
}

export function getMockFeaturedTools(): Tool[] {
  return mockTools.filter(tool => tool.isFeatured);
}

export function getMockPopularTools(limit = 5): Tool[] {
  return [...mockTools]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

export function getMockTrendingTools(limit = 5): Tool[] {
  // 模拟趋势算法：结合评分和使用量
  return [...mockTools]
    .sort((a, b) => (b.rating * b.usageCount) - (a.rating * a.usageCount))
    .slice(0, limit);
}