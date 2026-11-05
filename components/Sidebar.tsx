import type { Folder } from "@/app/_lib/types";
import AllButton from "./AllButton";
import FolderList from "./FolderList";

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
    <aside className="hidden w-60 shrink-0 flex-col gap-4 overflow-y-auto border-r border-zinc-200 p-4 dark:border-zinc-800 md:flex">
      <AllButton count={totalCount} active={allActive} />
      <FolderList folders={folders} activeFolderId={activeFolderId} />
    </aside>
  );
}
