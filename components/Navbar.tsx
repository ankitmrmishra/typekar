"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { useAuthStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

function Navbar() {
  const { data: session } = useSession();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const router = useRouter();
  const loggedIn = useAuthStore((state) => state.login);
  const loggedOut = useAuthStore((state) => state.logout);
  const setUsername = useAuthStore((state) => state.setUserName);
  const userName = useAuthStore((state) => state.userName);
  if (!session) loggedOut();
  if (session) {
    loggedIn();
    if (session.user?.name) setUsername(session.user?.name);
  }
  return (
    <div>
      <div className="border-b border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="relative text-2xl md:text-3xl font-light tracking-wider mb-2 md:mb-0 text-white">
              TypeKar
            </div>
            <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end">
              <div className="flex gap-2 md:gap-3 ml-2 md:ml-8 justify-between align-middle items-center">
                {isLoggedIn ? (
                  <button
                    className="px-4 md:px-6 py-2 border border-white/20 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 hover:border-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/40 text-white"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    className="px-4 md:px-6 py-2 border border-white/20 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 hover:border-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/40 text-white"
                    onClick={() => signIn("google")}
                  >
                    Sign In
                  </button>
                )}

                <button
                  className="px-4 md:px-6 py-2 border border-orange-400 bg-orange-400 text-black rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 flex justify-center align-middle items-center gap-2"
                  onClick={() => router.push("/dashboard")}
                >
                  LeaderBoard <ChartNoAxesCombined />
                </button>
                <span className="text-white">{userName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
