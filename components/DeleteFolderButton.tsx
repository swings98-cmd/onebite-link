"use client";

import { useState } from "react";
import DeleteFolderModal from "./DeleteFolderModal";

type Props = {
  folderId: string;
  folderName: string;
  linkCount: number;
};

export default function DeleteFolderButton({
  folderId,
  folderName,
  linkCount,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${folderName} 폴더 삭제`}
        className="folder-delete btn-icon absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[4px] text-[var(--text-sub)]"
      >
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </button>
      {open && (
        <DeleteFolderModal
          folderId={folderId}
          folderName={folderName}
          linkCount={linkCount}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
