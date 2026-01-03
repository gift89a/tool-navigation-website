import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

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

    const response = NextResponse.json({
      data: {
        tools: result.tools,
        pagination: result.pagination,
      },
      message: 'Tools fetched successfully',
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
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