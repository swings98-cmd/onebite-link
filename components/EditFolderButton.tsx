"use client";

import { useState } from "react";
import type { Folder } from "@/app/_lib/types";
import FolderFormModal from "./FolderFormModal";
import PencilIcon from "./icons/PencilIcon";

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
        <PencilIcon />
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
