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
        className="field rounded-[6px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-base text-[var(--text)]"
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
