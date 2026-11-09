import type { ReactNode } from "react";

export const authFieldClass =
  "field rounded-[6px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-base text-[var(--text)]";

export const authButtonClass =
  "btn-primary rounded-[6px] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40";

// 로그인·회원가입·비밀번호 찾기·재설정 페이지가 공유하는 중앙 정렬 레이아웃 (사이드바·헤더 없음)
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-[400px] flex-col gap-8">
        <p className="text-center text-[30px] font-bold leading-[1.2] text-[var(--text)]">
          🔖 한입 링크
        </p>
        {children}
      </div>
    </div>
  );
}
