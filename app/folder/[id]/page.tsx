import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import LinkGrid from "@/components/LinkGrid";
import { folders, links } from "../../_lib/mock-data";

export function generateStaticParams() {
  return folders.map((folder) => ({ id: folder.id }));
}

export default async function FolderPage(props: PageProps<"/folder/[id]">) {
  const { id } = await props.params;

  if (!folders.some((folder) => folder.id === id)) {
    notFound();
  }

  const folderLinks = links.filter((link) => link.folderId === id);

  return (
    <AppShell allActive={false} activeFolderId={id}>
      <LinkGrid links={folderLinks} />
    </AppShell>
  );
}
