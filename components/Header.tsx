import NewLinkButton from "./NewLinkButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--header-bg)] px-4 backdrop-blur-[8px]">
      <span className="text-base font-semibold text-[var(--text)]">
        🔖 한입 링크
      </span>
      <NewLinkButton />
    </header>
  );
}
