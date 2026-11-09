"use client";

import { useCallback, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/app/_actions/auth";
import FormField from "./FormField";
import Toast from "./Toast";

type Props = {
  mode: "login" | "signup";
};

const fieldClass =
  "field rounded-[6px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-base text-[var(--text)]";

export default function AuthForm({ mode }: Props) {
  const isSignup = mode === "signup";

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  const closeToast = useCallback(() => setToast(null), []);
  const showToast = (message: string) =>
    setToast({ id: Date.now(), message });

  // 회원가입은 세 입력, 로그인은 이메일·비밀번호가 모두 채워져야 버튼이 활성화된다.
  const canSubmit = isSignup
    ? email.trim() !== "" && password !== "" && passwordConfirm !== ""
    : email.trim() !== "" && password !== "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    if (isSignup && password !== passwordConfirm) {
      showToast("비밀번호가 일치하지 않아요.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await (isSignup ? signUp : signIn)(formData);
      if (result.error) {
        showToast(result.error);
        return;
      }
      router.push("/");
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      {toast && <Toast key={toast.id} message={toast.message} onClose={closeToast} />}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className={fieldClass}
              />
            </FormField>
          )}
          <button
            type="submit"
            disabled={!canSubmit || pending}
            className="btn-primary rounded-[6px] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSignup
              ? pending
                ? "가입하는 중..."
                : "회원가입"
              : pending
                ? "로그인하는 중..."
                : "로그인"}
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
