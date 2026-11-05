import type { Folder } from "@/app/_lib/types";
import FolderSelect from "./FolderSelect";
import LinkInput from "./LinkInput";
import SaveButton from "./SaveButton";

type Props = {
  folders: Folder[];
};

export default function NewLinkForm({ folders }: Props) {
  return (
    <section className="w-full">
      <h1 className="mb-8 text-[30px] font-bold leading-[1.2] text-[var(--text)]">
        새 링크 추가
      </h1>
      <form className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <LinkInput />
        <FolderSelect folders={folders} />
        <SaveButton />
      </form>
    </section>
  );
}
