"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  title: string;
  children: ReactNode;
  /** 삭제를 실행한다. error 를 돌려주면 모달 안에 표시하고 열어 둔다. */
  onConfirm: () => Promise<{ error?: string }>;
  onClose: () => void;
};

function ModalActions({ onCancel }: { onCancel: () => void }) {
  const { pending } = useFormStatus();

  return (
    <div className="mt-6 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        autoFocus
        className="btn-secondary rounded-[6px] border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]"
      >
        취소
      </button>
      <button
        type="submit"
        disabled={pending}
        className="btn-danger rounded-[6px] bg-[var(--error)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        삭제
      </button>
    </div>
  );
}

/** "정말 삭제할까요?" 확인 모달. 폴더·링크 삭제에서 함께 쓴다. */
export default function ConfirmDeleteModal({
  title,
  children,
  onConfirm,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function handleAction() {
    const result = await onConfirm();
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-delete-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-48px)] max-w-[400px] rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--text)] backdrop:bg-black/30"
    >
      <form action={handleAction}>
        <h2
          id="confirm-delete-title"
          className="mb-3 text-xl font-semibold leading-[1.3]"
        >
          {title}
        </h2>
        {children}
        <p className="mt-1 text-sm text-[var(--text-sub)]">
          삭제하면 되돌릴 수 없어요.
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-[var(--error)]">
            {error}
          </p>
        )}
        <ModalActions onCancel={onClose} />
      </form>
    </dialog>
  );
}
