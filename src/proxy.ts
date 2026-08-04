import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login"
  }
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/chat/:path*",
    "/mood/:path*",
    "/journal/:path*",
    "/memory-vault/:path*",
    "/analytics/:path*",
    "/recovery-tree/:path*",
    "/achievements/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/crisis/:path*"
  ]
}
