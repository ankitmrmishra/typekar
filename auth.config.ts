import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [Google],
  // The 'authorized' callback is used by the middleware for route protection.
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard");

      if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl)); // Redirect to a login page
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
