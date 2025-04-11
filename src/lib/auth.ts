import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  debug: true, // Always enable debug mode to help troubleshoot
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Auth attempt with email:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          // Convert email to lowercase for case-insensitive lookup
          const normalizedEmail = credentials.email.toLowerCase();
          
          // Get user from database with explicit field selection
          const user = await prisma.user.findFirst({
            where: {
              email: {
                equals: normalizedEmail,
                mode: 'insensitive' // Make the search case-insensitive
              },
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
            },
          });

          console.log('User found:', !!user);

          if (!user || !user.password) {
            console.log('User not found or no password set');
            return null;
          }

          // Verify password using bcrypt
          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log('Password valid:', isValid);

          if (!isValid) {
            console.log('Invalid password');
            return null;
          }

          // Return user object without password
          console.log('Authentication successful for:', user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day (reduced for testing)
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to token when signing in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        console.log("JWT callback - adding user data to token:", { 
          id: user.id,
          email: user.email,
          role: user.role
        });
      }
      return token;
    },
    async session({ session, token }) {
      // Add token info to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        console.log("Session callback - adding token data to session:", { 
          id: token.id,
          email: token.email,
          role: token.role
        });
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
};