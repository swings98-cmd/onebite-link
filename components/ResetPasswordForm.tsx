"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/app/_actions/auth";
import AuthLayout, { authButtonClass, authFieldClass } from "./AuthLayout";
import FormField from "./FormField";
import Toast from "./Toast";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  const closeToast = useCallback(() => setToast(null), []);
  const showToast = (message: string) => setToast({ id: Date.now(), message });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    if (password !== passwordConfirm) {
      showToast("비밀번호가 일치하지 않아요.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updatePassword(formData);
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
        <h1 className="text-xl font-semibold leading-[1.3] text-[var(--text)]">
          새 비밀번호 설정
        </h1>
        <FormField label="새 비밀번호" htmlFor="password">
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호를 입력하세요"
            className={authFieldClass}
          />
        </FormField>
        <FormField label="새 비밀번호 확인" htmlFor="password-confirm">
          <input
            id="password-confirm"
            name="passwordConfirm"
            type="password"
            required
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="새 비밀번호를 다시 입력하세요"
            className={authFieldClass}
          />
        </FormField>
        <button
          type="submit"
          disabled={password === "" || passwordConfirm === "" || pending}
          className={authButtonClass}
        >
          {pending ? "변경하는 중..." : "비밀번호 변경"}
        </button>
      </form>
    </AuthLayout>
  );
}
