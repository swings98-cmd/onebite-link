"use client";

import { useCallback, useState, useTransition } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/_actions/auth";
import AuthLayout, { authButtonClass, authFieldClass } from "./AuthLayout";
import FormField from "./FormField";
import Toast from "./Toast";

type Props = {
  initialError?: string;
};

export default function ForgotPasswordForm({ initialError }: Props) {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    initialError ? { id: 0, message: initialError } : null,
  );
  const [pending, startTransition] = useTransition();

  const closeToast = useCallback(() => setToast(null), []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await requestPasswordReset(formData);
      if (result.error) {
        setToast({ id: Date.now(), message: result.error });
        return;
      }
      setSentTo(email.trim());
    });
  }

  return (
    <AuthLayout>
      {toast && (
        <Toast key={toast.id} message={toast.message} onClose={closeToast} />
      )}
      {sentTo ? (
        <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
          <h1 className="text-xl font-semibold leading-[1.3] text-[var(--text)]">
            메일을 보냈어요
          </h1>
          <p className="text-sm text-[var(--text-sub)]">
            {sentTo} 으로 비밀번호 재설정 링크를 보냈어요. 메일함을 확인하고
            링크를 눌러 새 비밀번호를 설정해주세요.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold leading-[1.3] text-[var(--text)]">
              비밀번호 찾기
            </h1>
            <p className="text-sm text-[var(--text-sub)]">
              가입한 이메일로 비밀번호 재설정 링크를 보내드려요.
            </p>
          </div>
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
          <button
            type="submit"
            disabled={email.trim() === "" || pending}
            className={authButtonClass}
          >
            {pending ? "보내는 중..." : "비밀번호 재설정 링크 발송"}
          </button>
        </form>
      )}
      <p className="text-center text-sm">
        <Link href="/login" className="link-hover text-[var(--accent)]">
          로그인으로 돌아가기
        </Link>
      </p>
    </AuthLayout>
  );
}
