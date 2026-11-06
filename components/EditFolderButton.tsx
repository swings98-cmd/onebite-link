"use client";

import { useState } from "react";
import type { Folder } from "@/app/_lib/types";
import FolderFormModal from "./FolderFormModal";

type Props = {
  folder: Folder;
};

export default function EditFolderButton({ folder }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${folder.name} 폴더 이름 수정`}
        className="folder-action btn-icon absolute right-[34px] top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[4px] text-[var(--text-sub)]"
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
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>
      {open && (
        <FolderFormModal
          folder={{ id: folder.id, name: folder.name }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
