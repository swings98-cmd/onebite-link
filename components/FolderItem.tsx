import Link from "next/link";
import type { Folder } from "@/app/_lib/types";
import DeleteFolderButton from "./DeleteFolderButton";

type Props = {
  folder: Folder;
  active?: boolean;
};

export default function FolderItem({ folder, active = false }: Props) {
  return (
    // 삭제 버튼은 <a> 안에 넣을 수 없어서 링크와 형제로 두고, hover 배경은 행 전체에 준다.
    <div
      className={`folder-row nav-hover relative rounded-[6px] ${
        active ? "bg-[var(--hover-bg)]" : ""
      }`}
    >
      <Link
        href={`/folder/${folder.id}`}
        aria-current={active ? "page" : undefined}
        className={`flex h-9 w-full items-center justify-between rounded-[6px] px-3 text-sm text-[var(--text)] ${
          active ? "font-semibold" : ""
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <span aria-hidden>📁</span>
          <span className="truncate">{folder.name}</span>
        </span>
        <span className="folder-count text-[13px] text-[var(--text-sub)]">
          {folder.count}
        </span>
      </Link>
      <DeleteFolderButton
        folderId={folder.id}
        folderName={folder.name}
        linkCount={folder.count}
      />
    </div>
  );
}
