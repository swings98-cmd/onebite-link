"use client";

import { useState } from "react";
import type { Folder, LinkItem } from "@/app/_lib/types";
import EditLinkModal from "./EditLinkModal";
import PencilIcon from "./icons/PencilIcon";

type Props = {
  link: LinkItem;
  folders: Folder[];
};

export default function EditLinkButton({ link, folders }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${link.title} 링크 수정`}
        className="link-card-action btn-icon absolute right-[44px] top-2 flex h-7 w-7 items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--card)] text-[var(--text-sub)]"
      >
        <PencilIcon />
      </button>
      {open && (
        <EditLinkModal
          link={link}
          folders={folders}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
