import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import NewLinkForm from "@/components/NewLinkForm";
import { fetchFolders } from "../_lib/data";

async function NewLinkFormWithFolders() {
  const folders = await fetchFolders();
  return <NewLinkForm folders={folders} />;
}

export default function NewLinkPage() {
  return (
    <AppShell allActive={false}>
      <Suspense fallback={null}>
        <NewLinkFormWithFolders />
      </Suspense>
    </AppShell>
  );
}
