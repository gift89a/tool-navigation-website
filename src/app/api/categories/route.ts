import { NextResponse } from 'next/server';
import { getMockCategories } from '@/lib/mock-data';

export async function GET() {
  try {
    const categories = getMockCategories();

    const response = NextResponse.json({
      data: categories,
      message: 'Categories fetched successfully',
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch categories',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}