"use client";

import { useCallback, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/app/_actions/auth";
import AuthLayout, { authButtonClass, authFieldClass } from "./AuthLayout";
import FormField from "./FormField";
import Toast from "./Toast";

type Props = {
  mode: "login" | "signup";
};

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
  const showToast = (message: string) => setToast({ id: Date.now(), message });

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
    <AuthLayout>
      {toast && (
        <Toast key={toast.id} message={toast.message} onClose={closeToast} />
      )}
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
            className={authFieldClass}
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
            className={authFieldClass}
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
              className={authFieldClass}
            />
          </FormField>
        )}
        <button
          type="submit"
          disabled={!canSubmit || pending}
          className={authButtonClass}
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
      <div className="flex flex-col gap-2 text-center text-sm text-[var(--text-sub)]">
        {!isSignup && (
          <p>
            <Link
              href="/forgot-password"
              className="link-hover text-[var(--accent)]"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </p>
        )}
        <p>
          {isSignup ? "이미 계정이 있으신가요? " : "계정이 없으신가요? "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="link-hover text-[var(--accent)]"
          >
            {isSignup ? "로그인" : "회원가입"}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
