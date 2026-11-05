export default function SaveButton() {
  return (
    <button
      type="submit"
      className="btn-primary rounded-[6px] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      저장
    </button>
  );
}
