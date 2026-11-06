import { Suspense, type ReactNode } from "react";
import { cookies } from "next/headers";
import { links } from "@/app/_lib/mock-data";
import type { Folder } from "@/app/_lib/types";
import { createClient } from "@/utils/supabase/server";
import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
  allActive?: boolean;
  activeFolderId?: string;
};

async function fetchFolders(): Promise<Folder[]> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("folders")
    .select("id, name")
    .order("id", { ascending: true });
  if (error) throw error;

  return data.map((folder) => ({
    id: String(folder.id),
    name: folder.name,
    // 링크는 아직 DB로 옮기지 않았으므로 개수는 집계하지 않는다.
    count: 0,
  }));
}

async function SidebarWithFolders({
  allActive,
  activeFolderId,
}: Pick<Props, "allActive" | "activeFolderId">) {
  const folders = await fetchFolders();
  return (
    <Sidebar
      folders={folders}
      totalCount={links.length}
      allActive={allActive}
      activeFolderId={activeFolderId}
    />
  );
}

export default function AppShell({
  children,
  allActive = true,
  activeFolderId,
}: Props) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Suspense
          fallback={
            <Sidebar
              folders={[]}
              totalCount={links.length}
              allActive={allActive}
              activeFolderId={activeFolderId}
            />
          }
        >
          <SidebarWithFolders
            allActive={allActive}
            activeFolderId={activeFolderId}
          />
        </Suspense>
        <main className="flex-1 overflow-y-auto px-6 pb-10 pt-10">
          <div className="mx-auto w-full max-w-[720px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
