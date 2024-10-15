import { auth } from "./auth";

const publicRoutes = [
  "/sign-in",
  "/sign-up"
]

export default auth((req) => {
  if (!req.auth && !publicRoutes.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}