import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      tier: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    tier?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    tier?: string
  }
}
