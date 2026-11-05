import type { Folder } from "@/app/_lib/types";
import FolderItem from "./FolderItem";

type Props = {
  folders: Folder[];
  activeFolderId?: string;
};

export default function FolderList({ folders, activeFolderId }: Props) {
  return (
    <nav aria-label="폴더">
      <h2 className="mb-2 px-3 text-[13px] font-medium text-[var(--text-sub)]">폴더</h2>
      <ul className="flex flex-col gap-0.5">
        {folders.map((folder) => (
          <li key={folder.id}>
            <FolderItem folder={folder} active={folder.id === activeFolderId} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
