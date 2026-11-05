import Link from "next/link";

export default function NewLinkButton() {
  return (
    <Link
      href="/new"
      className="btn-primary inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-white"
    >
      <span aria-hidden className="text-base leading-none">
        +
      </span>
      새 링크
    </Link>
  );
}
