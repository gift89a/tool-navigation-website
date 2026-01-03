import { NextResponse } from 'next/server';
import { getMockCategories } from '@/lib/mock-data';

export async function GET() {
  try {
    const categories = getMockCategories();

    return NextResponse.json({
      data: categories,
      message: 'Categories fetched successfully',
    });
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