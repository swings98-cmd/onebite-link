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
      className={`flex h-9 w-full items-center justify-between rounded-lg px-3 text-sm transition-colors ${
        active
          ? "bg-zinc-100 font-semibold dark:bg-zinc-900"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
      }`}
    >
      <span className="flex items-center gap-2 truncate">
        <span aria-hidden>📁</span>
        <span className="truncate">{folder.name}</span>
      </span>
      <span className="text-xs text-zinc-500">{folder.count}</span>
    </Link>
  );
}
