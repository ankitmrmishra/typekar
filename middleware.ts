import { auth } from "@/auth";

export default auth;

export const config = {
  // The matcher specifies which routes the middleware should run on.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
