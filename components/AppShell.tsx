import { Suspense, type ReactNode } from "react";
import { fetchFolders, fetchLinkCount } from "@/app/_lib/data";
import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
  allActive?: boolean;
  activeFolderId?: string;
};

async function SidebarWithFolders({
  allActive,
  activeFolderId,
}: Pick<Props, "allActive" | "activeFolderId">) {
  const [folders, totalCount] = await Promise.all([
    fetchFolders(),
    fetchLinkCount(),
  ]);
  return (
    <Sidebar
      folders={folders}
      totalCount={totalCount}
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
              totalCount={0}
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
