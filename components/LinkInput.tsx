import FormField from "./FormField";

export default function LinkInput() {
  return (
    <FormField label="링크" htmlFor="url">
      <input
        id="url"
        name="url"
        type="url"
        required
        placeholder="https://example.com"
        className="field rounded-[6px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-base text-[var(--text)]"
      />
    </FormField>
  );
}
