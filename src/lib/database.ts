/**
 * 数据库配置和切换逻辑
 * 根据环境变量决定使用真实数据库还是 mock 数据
 */

import { prisma } from './prisma';
import * as mockData from './mock-data';

// 检查是否有有效的数据库连接
export const isDatabaseAvailable = () => {
  return !!(process.env.DATABASE_URL && process.env.DATABASE_URL !== 'postgresql://user:password@localhost:5432/db?schema=public');
};

// 数据库操作包装器
export const db = {
  // 获取分类
  async getCategories() {
    if (isDatabaseAvailable()) {
      try {
        return await prisma.category.findMany({
          where: { isActive: true },
          include: {
            _count: {
              select: { tools: true }
            }
          },
          orderBy: { name: 'asc' }
        });
      } catch (error) {
        console.warn('Database query failed, falling back to mock data:', error);
        return mockData.getMockCategories();
      }
    }
    return mockData.getMockCategories();
  },

  // 获取工具列表
  async getTools(options: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  } = {}) {
    if (isDatabaseAvailable()) {
      try {
        const { page = 1, limit = 12, category, search } = options;
        const skip = (page - 1) * limit;

        const where: any = { isActive: true };
        
        if (category) {
          where.category = { slug: category };
        }
        
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { tags: { some: { name: { contains: search, mode: 'insensitive' } } } }
          ];
        }

        const [tools, total] = await Promise.all([
          prisma.tool.findMany({
            where,
            include: {
              category: true,
              tags: true
            },
            orderBy: { usageCount: 'desc' },
            skip,
            take: limit
          }),
          prisma.tool.count({ where })
        ]);

        return {
          tools,
          pagination: {
            page,
            limit,
            total,
            hasMore: skip + limit < total
          }
        };
      } catch (error) {
        console.warn('Database query failed, falling back to mock data:', error);
        const tools = mockData.getMockTools(category, limit);
        return {
          tools,
          pagination: {
            page: 1,
            limit,
            total: tools.length,
            hasMore: false
          }
        };
      }
    }

    // 使用 mock 数据
    const tools = mockData.getMockTools(category, limit);
    return {
      tools,
      pagination: {
        page: 1,
        limit: limit || 12,
        total: tools.length,
        hasMore: false
      }
    };
  },

  // 获取单个工具
  async getToolById(id: string) {
    if (isDatabaseAvailable()) {
      try {
        return await prisma.tool.findUnique({
          where: { id },
          include: {
            category: true,
            tags: true
          }
        });
      } catch (error) {
        console.warn('Database query failed, falling back to mock data:', error);
        return mockData.getMockToolById(id);
      }
    }
    return mockData.getMockToolById(id);
  },

  // 搜索工具
  async searchTools(query: string, limit = 10) {
    if (isDatabaseAvailable()) {
      try {
        return await prisma.tool.findMany({
          where: {
            isActive: true,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { tags: { some: { name: { contains: query, mode: 'insensitive' } } } }
            ]
          },
          include: {
            category: true,
            tags: true
          },
          take: limit,
          orderBy: { usageCount: 'desc' }
        });
      } catch (error) {
        console.warn('Database query failed, falling back to mock data:', error);
        return mockData.searchMockTools(query);
      }
    }
    return mockData.searchMockTools(query);
  },

  // 获取热门工具
  async getPopularTools(limit = 5) {
    if (isDatabaseAvailable()) {
      try {
        return await prisma.tool.findMany({
          where: { isActive: true },
          include: {
            category: true,
            tags: true
          },
          orderBy: { usageCount: 'desc' },
          take: limit
        });
      } catch (error) {
        console.warn('Database query failed, falling back to mock data:', error);
        return mockData.getMockPopularTools(limit);
      }
    }
    return mockData.getMockPopularTools(limit);
  },

  // 获取趋势工具
  async getTrendingTools(limit = 5) {
    if (isDatabaseAvailable()) {
      try {
        // 这里可以实现更复杂的趋势算法
        return await prisma.tool.findMany({
          where: { isActive: true },
          include: {
            category: true,
            tags: true
          },
          orderBy: [
            { rating: 'desc' },
            { usageCount: 'desc' }
          ],
          take: limit
        });
      } catch (error) {
        console.warn('Database query failed, falling back to mock data:', error);
        return mockData.getMockTrendingTools(limit);
      }
    }
    return mockData.getMockTrendingTools(limit);
  }
};

export default db;