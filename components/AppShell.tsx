import type { ReactNode } from "react";
import { folders, links } from "@/app/_lib/mock-data";
import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
  allActive?: boolean;
  activeFolderId?: string;
};

export default function AppShell({
  children,
  allActive = true,
  activeFolderId,
}: Props) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          folders={folders}
          totalCount={links.length}
          allActive={allActive}
          activeFolderId={activeFolderId}
        />
        <main className="flex-1 overflow-y-auto px-6 pb-10 pt-10">
          <div className="mx-auto w-full max-w-[720px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
