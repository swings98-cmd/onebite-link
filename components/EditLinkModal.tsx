"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateLink } from "@/app/_actions/link";
import type { Folder, LinkItem } from "@/app/_lib/types";
import FormField from "./FormField";

type Props = {
  link: LinkItem;
  folders: Folder[];
  onClose: () => void;
};

const INPUT_CLASS =
  "field w-full rounded-[6px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-base text-[var(--text)]";

function ModalActions({
  canSave,
  onCancel,
}: {
  canSave: boolean;
  onCancel: () => void;
}) {
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

export default function EditLinkModal({ link, folders, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [folderId, setFolderId] = useState(link.folderId);
  const [title, setTitle] = useState(link.title);
  const [description, setDescription] = useState(link.description);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const changed =
    folderId !== link.folderId ||
    title.trim() !== link.title ||
    description.trim() !== link.description;

  async function handleAction(formData: FormData) {
    const result = await updateLink(link.id, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="edit-link-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-48px)] max-w-[480px] rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--text)] backdrop:bg-black/30"
    >
      <form action={handleAction} className="flex flex-col gap-4">
        <h2
          id="edit-link-title"
          className="text-xl font-semibold leading-[1.3]"
        >
          링크 수정
        </h2>

        <FormField label="폴더" htmlFor="edit-link-folder">
          <select
            id="edit-link-folder"
            name="folder"
            value={folderId}
            onChange={(e) => {
              setFolderId(e.target.value);
              setError(null);
            }}
            className={INPUT_CLASS}
          >
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="제목" htmlFor="edit-link-title-input">
          <input
            id="edit-link-title-input"
            name="title"
            type="text"
            autoFocus
            autoComplete="off"
            required
            maxLength={200}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField label="설명" htmlFor="edit-link-description">
          <textarea
            id="edit-link-description"
            name="description"
            rows={4}
            maxLength={500}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError(null);
            }}
            className={`${INPUT_CLASS} resize-none`}
          />
        </FormField>

        {error && (
          <p role="alert" className="text-sm text-[var(--error)]">
            {error}
          </p>
        )}
        <ModalActions
          canSave={changed && title.trim().length > 0}
          onCancel={onClose}
        />
      </form>
    </dialog>
  );
}
