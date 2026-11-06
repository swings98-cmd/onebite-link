"use server";

import { revalidatePath } from "next/cache";
import { folders, links } from "../_lib/mock-data";

const MAX_NAME_LENGTH = 30;

export type CreateFolderResult = { error?: string };

function validateName(
  formData: FormData,
  selfId?: string,
): { name: string } | { error: string } {
  const raw = formData.get("name");
  const name = typeof raw === "string" ? raw.trim() : "";

  if (!name) {
    return { error: "폴더 이름을 입력해주세요." };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { error: `폴더 이름은 ${MAX_NAME_LENGTH}자 이내로 입력해주세요.` };
  }
  if (folders.some((folder) => folder.name === name && folder.id !== selfId)) {
    return { error: "이미 같은 이름의 폴더가 있어요." };
  }
  return { name };
}

export async function createFolder(
  formData: FormData,
): Promise<CreateFolderResult> {
  const checked = validateName(formData);
  if ("error" in checked) return checked;

  folders.push({
    id: crypto.randomUUID().slice(0, 8),
    name: checked.name,
    count: 0,
  });

  // 사이드바(AppShell)가 모든 페이지에서 폴더 목록을 읽으므로 전체 레이아웃을 갱신한다.
  revalidatePath("/", "layout");
  return {};
}

export async function renameFolder(
  id: string,
  formData: FormData,
): Promise<CreateFolderResult> {
  const folder = folders.find((f) => f.id === id);
  if (!folder) {
    return { error: "존재하지 않는 폴더예요." };
  }

  const checked = validateName(formData, id);
  if ("error" in checked) return checked;

  folder.name = checked.name;

  revalidatePath("/", "layout");
  return {};
}

export async function deleteFolder(id: string): Promise<CreateFolderResult> {
  const index = folders.findIndex((folder) => folder.id === id);
  if (index === -1) {
    return { error: "이미 삭제되었거나 존재하지 않는 폴더예요." };
  }

  folders.splice(index, 1);

  // 폴더에 속해 있던 링크는 갈 곳이 없어지므로 함께 삭제한다.
  for (let i = links.length - 1; i >= 0; i--) {
    if (links[i].folderId === id) links.splice(i, 1);
  }

  revalidatePath("/", "layout");
  return {};
}
