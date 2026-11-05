import type { Folder } from "@/app/_lib/types";
import FolderSelect from "./FolderSelect";
import LinkInput from "./LinkInput";
import SaveButton from "./SaveButton";

type Props = {
  folders: Folder[];
};

export default function NewLinkForm({ folders }: Props) {
  return (
    <section className="mx-auto w-full max-w-xl">
      <h1 className="mb-6 text-xl font-bold">새 링크 추가</h1>
      <form className="flex flex-col gap-5">
        <LinkInput />
        <FolderSelect folders={folders} />
        <SaveButton />
      </form>
    </section>
  );
}
