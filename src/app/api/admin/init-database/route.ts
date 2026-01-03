import { NextResponse } from 'next/server';
import { mockCategories, mockTools } from '@/lib/mock-data';

export async function POST() {
  try {
    // Check if we're in build mode or if database is not configured
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      // Only run database operations in actual production environment
      if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
        return NextResponse.json(
          { error: 'Database not configured' },
          { status: 400 }
        );
      }

      // Dynamically import Prisma only when needed
      const { prisma } = await import('@/lib/prisma');

      // Test database connection
      await prisma.$connect();

      // Initialize categories
      console.log('Initializing categories...');
      for (const category of mockCategories) {
        await prisma.category.upsert({
          where: { slug: category.slug },
          update: {
            name: category.name,
            description: category.description,
            icon: category.icon,
            color: category.color,
          },
          create: {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            icon: category.icon,
            color: category.color,
          },
        });
      }

      // Initialize tools
      console.log('Initializing tools...');
      for (const tool of mockTools) {
        await prisma.tool.upsert({
          where: { id: tool.id },
          update: {
            name: tool.name,
            description: tool.description,
            url: tool.url,
            icon: tool.icon,
            rating: tool.rating,
            usageCount: tool.usageCount,
            isActive: tool.isActive,
            categoryId: tool.categoryId,
          },
          create: {
            id: tool.id,
            name: tool.name,
            description: tool.description,
            url: tool.url,
            icon: tool.icon,
            rating: tool.rating,
            usageCount: tool.usageCount,
            isActive: tool.isActive,
            categoryId: tool.categoryId,
          },
        });
      }

      await prisma.$disconnect();

      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
      });
    } else {
      // During build or development, return a mock response
      return NextResponse.json({
        success: false,
        message: 'Database initialization skipped during build',
      });
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    return NextResponse.json(
      { 
        error: 'Database initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}