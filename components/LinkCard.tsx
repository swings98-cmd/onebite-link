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
      className="card-hover flex h-full flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
    >
      <h3 className="truncate text-base font-semibold text-[var(--text)]">
        {link.title}
      </h3>
      <p className="line-clamp-2 text-sm leading-[1.4] text-[var(--text-sub)]">
        {link.description}
      </p>
      <span className="mt-auto w-fit max-w-full truncate rounded-[4px] bg-[var(--hover-bg)] px-2 py-0.5 text-[13px] text-[var(--text)]">
        {getHostname(link.url)}
      </span>
    </a>
  );
}
