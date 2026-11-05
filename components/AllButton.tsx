import Link from "next/link";

type Props = {
  count: number;
  active?: boolean;
};

export default function AllButton({ count, active = false }: Props) {
  return (
    <Link
      href="/"
      aria-current={active ? "page" : undefined}
      className={`nav-hover flex h-9 w-full items-center justify-between rounded-[6px] px-3 text-sm font-semibold text-[var(--text)] ${
        active ? "bg-[var(--hover-bg)]" : ""
      }`}
    >
      <span>전체</span>
      <span className="text-[13px] font-normal text-[var(--text-sub)]">
        {count}
      </span>
    </Link>
  );
}
