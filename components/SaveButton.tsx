type Props = {
  pending?: boolean;
};

export default function SaveButton({ pending = false }: Props) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary rounded-[6px] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? "링크 정보를 가져오는 중..." : "저장"}
    </button>
  );
}
