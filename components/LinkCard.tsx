import type { LinkItem } from "@/app/_lib/types";

type Props = {
  link: LinkItem;
};

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function LinkCard({ link }: Props) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full flex-col gap-2 rounded-xl border border-zinc-200 p-4 transition-shadow hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
    >
      <h3 className="truncate font-semibold">{link.title}</h3>
      <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
        {link.description}
      </p>
      <span className="mt-auto truncate pt-2 text-xs text-zinc-500">
        {getHostname(link.url)}
      </span>
    </a>
  );
}
