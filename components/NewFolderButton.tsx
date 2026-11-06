"use client";

import { useState } from "react";
import NewFolderModal from "./NewFolderModal";

export default function NewFolderButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--border)] px-4 py-1.5 text-sm font-medium text-[var(--text)]"
      >
        <span aria-hidden>📁</span>새 폴더
      </button>
      {open && <NewFolderModal onClose={() => setOpen(false)} />}
    </>
  );
}
