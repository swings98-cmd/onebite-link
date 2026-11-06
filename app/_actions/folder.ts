"use server";

import { revalidatePath } from "next/cache";
import { folders } from "../_lib/mock-data";

const MAX_NAME_LENGTH = 30;

export type CreateFolderResult = { error?: string };

export async function createFolder(
  formData: FormData,
): Promise<CreateFolderResult> {
  const raw = formData.get("name");
  const name = typeof raw === "string" ? raw.trim() : "";

  if (!name) {
    return { error: "폴더 이름을 입력해주세요." };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { error: `폴더 이름은 ${MAX_NAME_LENGTH}자 이내로 입력해주세요.` };
  }
  if (folders.some((folder) => folder.name === name)) {
    return { error: "이미 같은 이름의 폴더가 있어요." };
  }

  folders.push({ id: crypto.randomUUID().slice(0, 8), name, count: 0 });

  // 사이드바(AppShell)가 모든 페이지에서 폴더 목록을 읽으므로 전체 레이아웃을 갱신한다.
  revalidatePath("/", "layout");
  return {};
}
