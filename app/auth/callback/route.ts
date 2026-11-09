import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 비밀번호 재설정 메일의 링크가 도착하는 곳.
// 메일의 인증 코드를 세션으로 바꾼 뒤 재설정 페이지로 보낸다.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  // 외부 주소로 리다이렉트되지 않도록 앱 내부 경로만 허용한다.
  const next = searchParams.get("next");
  const path = next && /^\/(?!\/)/.test(next) ? next : "/";

  if (code) {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${path}`);
    }
  }

  return NextResponse.redirect(`${origin}/forgot-password?error=expired`);
}
