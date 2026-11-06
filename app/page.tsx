import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import LinkGrid from "@/components/LinkGrid";
import { fetchLinks } from "./_lib/data";

async function AllLinks() {
  const links = await fetchLinks();
  return <LinkGrid links={links} />;
}

export default function Home() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <AllLinks />
      </Suspense>
    </AppShell>
  );
}
