import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

// 인덱스, 폴더별, 새 링크 페이지는 로그인한 사용자만 접근할 수 있다.
export async function proxy(request: NextRequest) {
  const { response, user } = await createClient(request);

  if (!user) {
    const redirect = NextResponse.redirect(new URL("/login", request.url));
    // 토큰 갱신으로 바뀐 쿠키를 리다이렉트 응답에도 그대로 실어 보낸다.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: ["/", "/folder/:path*", "/new"],
};
