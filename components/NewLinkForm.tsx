"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addLink } from "@/app/_actions/link";
import type { Folder } from "@/app/_lib/types";
import FolderSelect from "./FolderSelect";
import LinkInput from "./LinkInput";
import SaveButton from "./SaveButton";

type Props = {
  folders: Folder[];
};

export default function NewLinkForm({ folders }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await addLink(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/folder/${result.folderId}`);
    });
  }

  return (
    <section className="w-full">
      <h1 className="mb-8 text-[30px] font-bold leading-[1.2] text-[var(--text)]">
        새 링크 추가
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
      >
        <LinkInput />
        <FolderSelect folders={folders} />
        {error && (
          <p role="alert" className="text-sm text-[var(--error)]">
            {error}
          </p>
        )}
        <SaveButton pending={pending} />
      </form>
    </section>
  );
}
