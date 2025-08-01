import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // Spread the Edge-safe configuration
  adapter: DrizzleAdapter(db), // Add the database adapter here
  session: { strategy: "database" },
});
