"use client";

import { useState } from "react";
import { deleteLink } from "@/app/_actions/link";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import TrashIcon from "./icons/TrashIcon";

type Props = {
  linkId: string;
  linkTitle: string;
};

export default function DeleteLinkButton({ linkId, linkTitle }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${linkTitle} 링크 삭제`}
        className="link-card-action btn-icon absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--card)] text-[var(--text-sub)]"
      >
        <TrashIcon />
      </button>
      {open && (
        <ConfirmDeleteModal
          title="링크를 삭제할까요?"
          onConfirm={() => deleteLink(linkId)}
          onClose={() => setOpen(false)}
        >
          <p className="line-clamp-2 text-base">
            <strong className="font-semibold">&lsquo;{linkTitle}&rsquo;</strong>{" "}
            링크를 삭제합니다.
          </p>
        </ConfirmDeleteModal>
      )}
    </>
  );
}
