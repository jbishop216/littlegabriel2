import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Add debug handler that wraps NextAuth
async function debugHandler(req: NextRequest, context: any) {
  console.log('NextAuth API route called', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });
  
  try {
    const handler = NextAuth(authOptions);
    const response = await handler(req, context);
    console.log('NextAuth response status:', response.status);
    return response;
  } catch (error) {
    console.error('NextAuth handler error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export { debugHandler as GET, debugHandler as POST };