import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateUser } from '@/lib/api/auth';
import { AuthenticationRequest } from '@/types/user';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'EthioBite Login',
      credentials: {
        username: { 
          label: 'Phone Number', 
          type: 'tel',
          placeholder: '+251 9XX XXX XXX'
        },
        password: { 
          label: 'Password', 
          type: 'password' 
        },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Phone number and password are required');
        }

        try {
          const authRequest: AuthenticationRequest = {
            userName: credentials.username.replace(/\s+/g, ''), // Remove spaces
            password: credentials.password,
          };

          const tokenPayload = await authenticateUser(authRequest);

          if (!tokenPayload.token || !tokenPayload.pid) {
            throw new Error('Invalid response from server');
          }

          return {
            id: tokenPayload.pid,
            pid: tokenPayload.pid,
            name: `${tokenPayload.firstName} ${tokenPayload.lastName}`,
            email: tokenPayload.email,
            username: tokenPayload.username,
            token: tokenPayload.token,
            roles: tokenPayload.roles || [],
            image: null, // Will be loaded from profile if available
          };
        } catch (error: any) {
          console.error('Authentication error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.roles = user.roles;
        token.pid = user.pid;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.roles = token.roles as string[];
        session.user.pid = token.pid as string;
        session.user.username = token.username as string;
        
        // Store pid in localStorage for API requests
        if (typeof window !== 'undefined') {
          localStorage.setItem('pid', token.pid as string);
          if (token.accessToken) {
            localStorage.setItem('token', token.accessToken as string);
          }
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful login
      if (url === baseUrl) {
        return `${baseUrl}/dashboard`;
      }
      // Allow relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Allow same origin URLs
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
};