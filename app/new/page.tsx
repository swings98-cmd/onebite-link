import AppShell from "@/components/AppShell";
import NewLinkForm from "@/components/NewLinkForm";
import { folders } from "../_lib/mock-data";

export default function NewLinkPage() {
  return (
    <AppShell allActive={false}>
      <NewLinkForm folders={folders} />
    </AppShell>
  );
}
