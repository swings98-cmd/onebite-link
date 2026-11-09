import type { Folder } from "@/app/_lib/types";
import AllButton from "./AllButton";
import FolderList from "./FolderList";
import LogoutButton from "./LogoutButton";

type Props = {
  folders: Folder[];
  totalCount: number;
  allActive?: boolean;
  activeFolderId?: string;
};

export default function Sidebar({
  folders,
  totalCount,
  allActive = true,
  activeFolderId,
}: Props) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-6 overflow-y-auto border-r border-[var(--border)] bg-[var(--bg)] p-4 md:flex">
      <AllButton count={totalCount} active={allActive} />
      <FolderList folders={folders} activeFolderId={activeFolderId} />
      <LogoutButton />
    </aside>
  );
}
