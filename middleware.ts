import { auth } from "./auth";

const publicRoutes = [
  "/sign-in",
  "/sign-up"
]

export default auth((req) => {
  if (!req.auth && !publicRoutes.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin)
    return Response.redirect(newUrl)
  } else if (req.auth && req.nextUrl.pathname == "/sign-in") {
    const newUrl = new URL("/", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}