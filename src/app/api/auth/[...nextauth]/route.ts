import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug handler for Next Auth
 */
async function authHandler(
  req: NextRequest,
  { params }: { params: { nextauth: string[] } }
) {
  console.log('NextAuth API route called', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });
  
  try {
    const handler = NextAuth(authOptions);
    const response = await handler(req, { params });
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

// Export GET and POST handlers
export { authHandler as GET, authHandler as POST };