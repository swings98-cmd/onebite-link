import type { Folder } from "@/app/_lib/types";
import FormField from "./FormField";

type Props = {
  folders: Folder[];
};

export default function FolderSelect({ folders }: Props) {
  return (
    <FormField label="폴더" htmlFor="folder">
      <select
        id="folder"
        name="folder"
        required
        defaultValue=""
        className="h-10 rounded-lg border border-zinc-300 bg-background px-3 text-sm outline-none transition-colors focus:border-foreground dark:border-zinc-700"
      >
        <option value="" disabled>
          폴더를 선택하세요
        </option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
    </FormField>
  );
}
