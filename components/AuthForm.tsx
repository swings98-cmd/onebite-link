"use client";

import Link from "next/link";
import FormField from "./FormField";

type Props = {
  mode: "login" | "signup";
};

const fieldClass =
  "field rounded-[6px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-base text-[var(--text)]";

export default function AuthForm({ mode }: Props) {
  const isSignup = mode === "signup";

  // 인증 기능은 아직 구현하지 않는다. 폼이 GET 으로 제출되어
  // 입력값이 URL 에 노출되지 않도록 기본 제출 동작만 막아 둔다.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-[400px] flex-col gap-8">
        <p className="text-center text-[30px] font-bold leading-[1.2] text-[var(--text)]">
          🔖 한입 링크
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <FormField label="이메일" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="example@email.com"
              className={fieldClass}
            />
          </FormField>
          <FormField label="비밀번호" htmlFor="password">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="비밀번호를 입력하세요"
              className={fieldClass}
            />
          </FormField>
          {isSignup && (
            <FormField label="비밀번호 확인" htmlFor="password-confirm">
              <input
                id="password-confirm"
                name="passwordConfirm"
                type="password"
                required
                autoComplete="new-password"
                placeholder="비밀번호를 다시 입력하세요"
                className={fieldClass}
              />
            </FormField>
          )}
          <button
            type="submit"
            className="btn-primary rounded-[6px] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
          >
            {isSignup ? "회원가입" : "로그인"}
          </button>
        </form>
        <p className="text-center text-sm text-[var(--text-sub)]">
          {isSignup ? "이미 계정이 있으신가요? " : "계정이 없으신가요? "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="link-hover text-[var(--accent)]"
          >
            {isSignup ? "로그인" : "회원가입"}
          </Link>
        </p>
      </div>
    </div>
  );
}
