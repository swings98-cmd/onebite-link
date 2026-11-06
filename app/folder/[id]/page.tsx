import { Suspense } from "react";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import LinkGrid from "@/components/LinkGrid";
import { fetchLinks, folderExists } from "../../_lib/data";

async function FolderContent({ params }: { params: PageProps<"/folder/[id]">["params"] }) {
  const { id } = await params;

  if (!(await folderExists(id))) {
    notFound();
  }

  const folderLinks = await fetchLinks(id);

  return (
    <AppShell allActive={false} activeFolderId={id}>
      <LinkGrid links={folderLinks} />
    </AppShell>
  );
}

export default function FolderPage(props: PageProps<"/folder/[id]">) {
  // 폴더 목록은 요청 시점에 DB에서 읽으므로 params 접근을 Suspense 안에서 처리한다.
  return (
    <Suspense fallback={null}>
      <FolderContent params={props.params} />
    </Suspense>
  );
}
