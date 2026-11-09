import { signOut } from "@/app/_actions/auth";

export default function LogoutButton() {
  return (
    <form action={signOut} className="mt-auto">
      <button
        type="submit"
        className="nav-hover w-full rounded-[6px] px-3 py-2 text-left text-sm text-[var(--text-sub)]"
      >
        로그아웃
      </button>
    </form>
  );
}
