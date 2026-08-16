import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    roles?: string[];
    user: {
      id: string;
      pid: string;
      name?: string | null;
      email?: string | null;
      username?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    pid: string;
    token: string;
    username: string;
    roles: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    roles?: string[];
    pid?: string;
  }
}