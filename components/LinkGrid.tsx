import type { LinkItem } from "@/app/_lib/types";
import { fetchFolders } from "@/app/_lib/data";
import LinkCard from "./LinkCard";

type Props = {
  links: LinkItem[];
};

export default async function LinkGrid({ links }: Props) {
  // 링크 수정 모달의 폴더 선택 목록에 쓴다.
  const folders = await fetchFolders();

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard link={link} folders={folders} />
        </li>
      ))}
    </ul>
  );
}
