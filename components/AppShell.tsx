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
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
