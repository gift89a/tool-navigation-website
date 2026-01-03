import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const result = await db.getTools({
      page,
      limit,
      category,
      search
    });

    return NextResponse.json({
      data: {
        tools: result.tools,
        pagination: result.pagination,
      },
      message: 'Tools fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch tools',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}