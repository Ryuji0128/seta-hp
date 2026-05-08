export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/products-manage/:path*",
    "/gallery-manage/:path*",
    "/works-manage/:path*",
    "/news/:path*",
  ],
};
