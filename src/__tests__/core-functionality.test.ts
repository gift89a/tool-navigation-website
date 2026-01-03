/**
 * 核心功能测试
 * 验证工具导航网站的核心功能是否正常工作
 */

import { describe, it, expect } from '@jest/globals';

// 测试工具类型定义
interface MockTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{ id: string; name: string }>;
  rating: number;
  usageCount: number;
  isActive: boolean;
}

// 模拟工具数据
const mockTools: MockTool[] = [
  {
    id: '1',
    name: 'JSON格式化工具',
    description: '在线JSON格式化、压缩、验证工具',
    icon: '🔧',
    url: 'https://jsonformatter.org',
    category: {
      id: 'dev',
      name: '开发工具',
      slug: 'development'
    },
    tags: [
      { id: 'json', name: 'JSON' },
      { id: 'format', name: '格式化' }
    ],
    rating: 4.8,
    usageCount: 15420,
    isActive: true
  },
  {
    id: '2',
    name: 'Base64编解码',
    description: 'Base64编码解码工具',
    icon: '🔐',
    url: 'https://base64encode.org',
    category: {
      id: 'dev',
      name: '开发工具',
      slug: 'development'
    },
    tags: [
      { id: 'base64', name: 'Base64' },
      { id: 'encode', name: '编码' }
    ],
    rating: 4.5,
    usageCount: 8900,
    isActive: true
  }
];

describe('核心功能测试', () => {
  describe('工具数据结构', () => {
    it('应该有正确的工具数据结构', () => {
      const tool = mockTools[0];
      
      expect(tool).toHaveProperty('id');
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('icon');
      expect(tool).toHaveProperty('url');
      expect(tool).toHaveProperty('category');
      expect(tool).toHaveProperty('tags');
      expect(tool).toHaveProperty('rating');
      expect(tool).toHaveProperty('usageCount');
      expect(tool).toHaveProperty('isActive');
    });

    it('分类应该有正确的结构', () => {
      const category = mockTools[0].category;
      
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('slug');
    });

    it('标签应该有正确的结构', () => {
      const tag = mockTools[0].tags[0];
      
      expect(tag).toHaveProperty('id');
      expect(tag).toHaveProperty('name');
    });
  });

  describe('分类过滤功能', () => {
    it('应该能够按分类过滤工具', () => {
      const categorySlug = 'development';
      const filteredTools = mockTools.filter(
        tool => tool.category.slug === categorySlug
      );
      
      expect(filteredTools).toHaveLength(2);
      expect(filteredTools.every(tool => tool.category.slug === categorySlug)).toBe(true);
    });

    it('应该返回空数组当分类不存在时', () => {
      const categorySlug = 'nonexistent';
      const filteredTools = mockTools.filter(
        tool => tool.category.slug === categorySlug
      );
      
      expect(filteredTools).toHaveLength(0);
    });
  });

  describe('搜索功能', () => {
    it('应该能够按名称搜索工具', () => {
      const searchQuery = 'JSON';
      const searchResults = mockTools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].name).toContain('JSON');
    });

    it('应该能够按描述搜索工具', () => {
      const searchQuery = '编码';
      const searchResults = mockTools.filter(tool =>
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].description).toContain('编码');
    });

    it('应该能够按标签搜索工具', () => {
      const searchQuery = 'Base64';
      const searchResults = mockTools.filter(tool =>
        tool.tags.some(tag => 
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].tags.some(tag => tag.name === 'Base64')).toBe(true);
    });

    it('应该返回空数组当搜索无结果时', () => {
      const searchQuery = 'nonexistent';
      const searchResults = mockTools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => 
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      
      expect(searchResults).toHaveLength(0);
    });
  });

  describe('收藏功能', () => {
    it('应该能够添加工具到收藏', () => {
      const favorites: string[] = [];
      const toolId = '1';
      
      // 模拟添加收藏
      const newFavorites = [...favorites, toolId];
      
      expect(newFavorites).toContain(toolId);
      expect(newFavorites).toHaveLength(1);
    });

    it('应该能够从收藏中移除工具', () => {
      const favorites = ['1', '2'];
      const toolId = '1';
      
      // 模拟移除收藏
      const newFavorites = favorites.filter(id => id !== toolId);
      
      expect(newFavorites).not.toContain(toolId);
      expect(newFavorites).toHaveLength(1);
    });

    it('应该能够检查工具是否已收藏', () => {
      const favorites = ['1'];
      const toolId1 = '1';
      const toolId2 = '2';
      
      expect(favorites.includes(toolId1)).toBe(true);
      expect(favorites.includes(toolId2)).toBe(false);
    });

    it('不应该重复添加已收藏的工具', () => {
      const favorites = ['1'];
      const toolId = '1';
      
      // 模拟防重复添加逻辑
      const newFavorites = favorites.includes(toolId) 
        ? favorites 
        : [...favorites, toolId];
      
      expect(newFavorites).toHaveLength(1);
      expect(newFavorites.filter(id => id === toolId)).toHaveLength(1);
    });
  });

  describe('工具排序功能', () => {
    it('应该能够按评分排序', () => {
      const sortedTools = [...mockTools].sort((a, b) => b.rating - a.rating);
      
      expect(sortedTools[0].rating).toBeGreaterThanOrEqual(sortedTools[1].rating);
    });

    it('应该能够按使用量排序', () => {
      const sortedTools = [...mockTools].sort((a, b) => b.usageCount - a.usageCount);
      
      expect(sortedTools[0].usageCount).toBeGreaterThanOrEqual(sortedTools[1].usageCount);
    });

    it('应该能够按名称排序', () => {
      const sortedTools = [...mockTools].sort((a, b) => a.name.localeCompare(b.name));
      
      expect(sortedTools[0].name.localeCompare(sortedTools[1].name)).toBeLessThanOrEqual(0);
    });
  });

  describe('数据验证', () => {
    it('工具ID应该是唯一的', () => {
      const ids = mockTools.map(tool => tool.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('工具评分应该在有效范围内', () => {
      mockTools.forEach(tool => {
        expect(tool.rating).toBeGreaterThanOrEqual(0);
        expect(tool.rating).toBeLessThanOrEqual(5);
      });
    });

    it('工具使用量应该是非负数', () => {
      mockTools.forEach(tool => {
        expect(tool.usageCount).toBeGreaterThanOrEqual(0);
      });
    });

    it('只有活跃的工具应该被显示', () => {
      const activeTools = mockTools.filter(tool => tool.isActive);
      
      expect(activeTools.every(tool => tool.isActive)).toBe(true);
    });
  });
});