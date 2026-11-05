import type { LinkItem } from "@/app/_lib/types";
import LinkCard from "./LinkCard";

type Props = {
  links: LinkItem[];
};

export default function LinkGrid({ links }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard link={link} />
        </li>
      ))}
    </ul>
  );
}
