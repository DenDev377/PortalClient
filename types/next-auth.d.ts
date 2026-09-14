import NextAuth from "next-auth"

// Extend session and JWT to include role and clientId
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      clientId?: string | null
    } & DefaultSession["user"]
  }
  
  interface User {
    id: string
    role: string
    clientId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    clientId?: string | null
  }
}
