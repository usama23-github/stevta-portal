import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JwtPayload {
  id: string;
  role: string;
  officeId: string | null;
  instituteId: string | null;
  staffId: string | null;
}

async function verifyToken(token: string): Promise<JwtPayload> {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET
  );

  const { payload } = await jwtVerify(token, secret);

  return payload as unknown as JwtPayload;
}

export async function proxy(request: NextRequest) {
  // const token = request.cookies.get("token")?.value;

  // const isAuthPage =
  //   request.nextUrl.pathname === "/sign-in";

  // const protectedRoutes = [
  //   "/admin",
  //   "/college-dashboard",
  //   "/profile",
  // ];

  // const isProtectedRoute = protectedRoutes.some((route) =>
  //   request.nextUrl.pathname.startsWith(route)
  // );

  // if (isProtectedRoute) {
  //   if (!token) {
  //     return NextResponse.redirect(
  //       new URL("/sign-in", request.url)
  //     );
  //   }

  //   try {
  //     const decoded = await verifyToken(token);

  //     if (
  //       request.nextUrl.pathname.startsWith("/admin") &&
  //       decoded.role !== "ADMIN"
  //     ) {
  //       return NextResponse.redirect(
  //         new URL("/unauthorized", request.url)
  //       );
  //     }
  //   } catch {
  //     const response = NextResponse.redirect(
  //       new URL("/sign-in", request.url)
  //     );

  //     response.cookies.delete("token");

  //     return response;
  //   }
  // }

  // if (isAuthPage && token) {
  //   try {
  //     await verifyToken(token);

  //     return NextResponse.redirect(
  //       new URL("/college-dashboard")
  //     );
  //   } catch {
  //     // allow access to sign-in page
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/admin/:path*",
    "/college-dashboard/:path*",
    "/profile/:path*",
  ],
};