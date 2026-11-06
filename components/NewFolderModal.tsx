"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createFolder } from "@/app/_actions/folder";

type Props = {
  onClose: () => void;
};

function ModalActions({ canSave, onCancel }: { canSave: boolean; onCancel: () => void }) {
  const { pending } = useFormStatus();

  return (
    <div className="mt-6 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="btn-secondary rounded-[6px] border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]"
      >
        취소
      </button>
      <button
        type="submit"
        disabled={!canSave || pending}
        className="btn-primary rounded-[6px] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        저장
      </button>
    </div>
  );
}

export default function NewFolderModal({ onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function handleAction(formData: FormData) {
    const result = await createFolder(formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="new-folder-title"
      onClose={onClose}
      onClick={(e) => {
        // 백드롭(dialog 자신) 클릭 시 닫기
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-48px)] max-w-[400px] rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--text)] backdrop:bg-black/30"
    >
      <form action={handleAction}>
        <h2
          id="new-folder-title"
          className="mb-4 text-xl font-semibold leading-[1.3]"
        >
          새 폴더
        </h2>
        <label
          htmlFor="folder-name"
          className="mb-1.5 block text-sm font-medium"
        >
          폴더 이름
        </label>
        <input
          id="folder-name"
          name="name"
          type="text"
          autoFocus
          autoComplete="off"
          maxLength={30}
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "folder-name-error" : undefined}
          placeholder="폴더 이름을 입력하세요"
          className={`field w-full rounded-[6px] border bg-[var(--card)] px-3 py-2 text-base text-[var(--text)] ${
            error ? "border-[var(--error)]" : "border-[var(--border)]"
          }`}
        />
        {error && (
          <p
            id="folder-name-error"
            role="alert"
            className="mt-1.5 text-sm text-[var(--error)]"
          >
            {error}
          </p>
        )}
        <ModalActions canSave={name.trim().length > 0} onCancel={onClose} />
      </form>
    </dialog>
  );
}
