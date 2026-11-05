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
      className={`flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm font-semibold transition-colors ${
        active
          ? "bg-foreground text-background"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
      }`}
    >
      <span>ALL</span>
      <span className="text-xs font-normal opacity-70">{count}</span>
    </Link>
  );
}
