import Link from "next/link";
import type { Folder } from "@/app/_lib/types";

type Props = {
  folder: Folder;
  active?: boolean;
};

export default function FolderItem({ folder, active = false }: Props) {
  return (
    <Link
      href={`/folder/${folder.id}`}
      aria-current={active ? "page" : undefined}
      className={`nav-hover flex h-9 w-full items-center justify-between rounded-[6px] px-3 text-sm text-[var(--text)] ${
        active ? "bg-[var(--hover-bg)] font-semibold" : ""
      }`}
    >
      <span className="flex items-center gap-2 truncate">
        <span aria-hidden>📁</span>
        <span className="truncate">{folder.name}</span>
      </span>
      <span className="text-[13px] text-[var(--text-sub)]">{folder.count}</span>
    </Link>
  );
}
