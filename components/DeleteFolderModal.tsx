"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { deleteFolder } from "@/app/_actions/folder";

type Props = {
  folderId: string;
  folderName: string;
  linkCount: number;
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

export default function DeleteFolderModal({
  folderId,
  folderName,
  linkCount,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function handleAction() {
    const result = await deleteFolder(folderId);
    if (result.error) {
      setError(result.error);
      return;
    }
    // 지금 보고 있던 폴더를 지웠다면 전체 목록으로 이동한다.
    if (pathname === `/folder/${folderId}`) router.replace("/");
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-folder-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-48px)] max-w-[400px] rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--text)] backdrop:bg-black/30"
    >
      <form action={handleAction}>
        <h2
          id="delete-folder-title"
          className="mb-3 text-xl font-semibold leading-[1.3]"
        >
          폴더를 삭제할까요?
        </h2>
        <p className="text-base">
          <strong className="font-semibold">&lsquo;{folderName}&rsquo;</strong>{" "}
          폴더를 삭제합니다.
          {linkCount > 0 && ` 폴더 안의 링크 ${linkCount}개도 함께 삭제돼요.`}
        </p>
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
