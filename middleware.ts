import { NextResponse } from "next/server";
import { authMiddleware } from "./app/middlewares/api/authMiddleware";
import { logMiddleware } from "./app/middlewares/api/logMiddeware";

export const config = {
  matcher: "/api/:path*",
};

export default function middleware(request: Request) {
  const authResult = authMiddleware(request);

  if (request.url.includes("/api/blogs")) {
    const logResult = logMiddleware(request);
    console.log(logResult.response);
  }

  // if (!authResult?.isValid && request.url.includes("/api/blogs")) {
  // return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
  // status: 404,
  // });
  // }

  if (!authResult?.isValid) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.next();
}
