"use client";

import { useState } from "react";
import DeleteFolderModal from "./DeleteFolderModal";
import TrashIcon from "./icons/TrashIcon";

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
        className="folder-action btn-icon absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[4px] text-[var(--text-sub)]"
      >
        <TrashIcon />
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
