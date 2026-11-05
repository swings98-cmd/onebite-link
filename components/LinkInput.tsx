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
        className="h-10 rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-foreground dark:border-zinc-700"
      />
    </FormField>
  );
}
