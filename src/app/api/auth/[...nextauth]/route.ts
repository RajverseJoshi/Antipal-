import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-google-client-secret"
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Placeholders check as requested
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Mock verification
        // Check for specific valid emails or just allow mock credentials logging
        return {
          id: "mock-user-id-12345",
          name: "Aarav Sharma",
          email: credentials.email
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return true;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: user.id, // Ensure Prisma ID matches NextAuth ID
              email: user.email,
              passwordHash: "auto-generated-no-password", // Required by schema
              subscription_tier: "free",
              tier: "FREE",
              daily_message_count: 0
            }
          });
        }
      } catch (error) {
        console.error("Error auto-creating user during signIn:", error);
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        // Fetch fresh tier from DB on initial sign-in
        try {
          const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
          token.tier = dbUser?.tier || "FREE"
        } catch (e) {
          token.tier = "FREE"
        }
      } else if (!token.tier && token.id) {
        // Fallback if token somehow misses tier
        try {
          const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } })
          token.tier = dbUser?.tier || "FREE"
        } catch (e) {
          token.tier = "FREE"
        }
      }
      
      // Update triggered from client session.update()
      if (trigger === "update" && session?.tier) {
        token.tier = session.tier
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).tier = token.tier as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "placeholder-secret-antipal-development-123456"
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
