"use client";

import { usePathname, useRouter } from "next/navigation";
import { deleteFolder } from "@/app/_actions/folder";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Props = {
  folderId: string;
  folderName: string;
  linkCount: number;
  onClose: () => void;
};

export default function DeleteFolderModal({
  folderId,
  folderName,
  linkCount,
  onClose,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleConfirm() {
    const result = await deleteFolder(folderId);
    // 지금 보고 있던 폴더를 지웠다면 전체 목록으로 이동한다.
    if (!result.error && pathname === `/folder/${folderId}`) router.replace("/");
    return result;
  }

  return (
    <ConfirmDeleteModal
      title="폴더를 삭제할까요?"
      onConfirm={handleConfirm}
      onClose={onClose}
    >
      <p className="text-base">
        <strong className="font-semibold">&lsquo;{folderName}&rsquo;</strong>{" "}
        폴더를 삭제합니다.
        {linkCount > 0 && ` 폴더 안의 링크 ${linkCount}개도 함께 삭제돼요.`}
      </p>
    </ConfirmDeleteModal>
  );
}
