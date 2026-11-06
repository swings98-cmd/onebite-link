import { Suspense } from "react";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import LinkGrid from "@/components/LinkGrid";
import { folders, links } from "../../_lib/mock-data";

export function generateStaticParams() {
  return folders.map((folder) => ({ id: folder.id }));
}

async function FolderContent({ params }: { params: PageProps<"/folder/[id]">["params"] }) {
  const { id } = await params;

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

export default function FolderPage(props: PageProps<"/folder/[id]">) {
  // 사용자가 새로 만든 폴더는 generateStaticParams에 없으므로
  // params 접근을 Suspense 안에서 처리해야 요청 시점 렌더링이 가능하다.
  return (
    <Suspense fallback={null}>
      <FolderContent params={props.params} />
    </Suspense>
  );
}
