import type { Folder, LinkItem } from "@/app/_lib/types";
import DeleteLinkButton from "./DeleteLinkButton";
import EditLinkButton from "./EditLinkButton";
import LinkThumbnail from "./LinkThumbnail";

type Props = {
  link: LinkItem;
  folders: Folder[];
};

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function LinkCard({ link, folders }: Props) {
  return (
    // 수정·삭제 버튼은 <a> 안에 넣을 수 없어서 링크와 형제로 두고, 카드 스타일은 바깥 래퍼가 가진다.
    <div className="link-card card-hover relative h-full rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col gap-2 rounded-lg p-4"
      >
        {link.thumbnail && <LinkThumbnail src={link.thumbnail} />}
        {/* 썸네일이 없으면 우측 상단 수정·삭제 버튼이 제목 위에 놓이므로 자리를 비워 둔다 */}
        <h3
          className={`truncate text-base font-semibold text-[var(--text)] ${
            link.thumbnail ? "" : "pr-[72px]"
          }`}
        >
          {link.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-[1.4] text-[var(--text-sub)]">
          {link.description}
        </p>
        <span className="mt-auto w-fit max-w-full truncate rounded-[4px] bg-[var(--hover-bg)] px-2 py-0.5 text-[13px] text-[var(--text)]">
          {getHostname(link.url)}
        </span>
      </a>
      <EditLinkButton link={link} folders={folders} />
      <DeleteLinkButton linkId={link.id} linkTitle={link.title} />
    </div>
  );
}
