import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockCategories, mockTools } from '@/lib/mock-data';

export async function POST() {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 400 }
      );
    }

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
          isActive: category.isActive,
        },
        create: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          color: category.color,
          isActive: category.isActive,
        },
      });
    }

    // Initialize tools
    console.log('Initializing tools...');
    for (const tool of mockTools) {
      await prisma.tool.upsert({
        where: { slug: tool.slug },
        update: {
          name: tool.name,
          description: tool.description,
          url: tool.url,
          icon: tool.icon,
          rating: tool.rating,
          usageCount: tool.usageCount,
          isActive: tool.isActive,
          isFeatured: tool.isFeatured,
          categoryId: tool.categoryId,
        },
        create: {
          id: tool.id,
          name: tool.name,
          slug: tool.slug,
          description: tool.description,
          url: tool.url,
          icon: tool.icon,
          rating: tool.rating,
          usageCount: tool.usageCount,
          isActive: tool.isActive,
          isFeatured: tool.isFeatured,
          categoryId: tool.categoryId,
        },
      });
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
    });
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