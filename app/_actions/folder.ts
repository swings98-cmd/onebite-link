"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const MAX_NAME_LENGTH = 30;

export type CreateFolderResult = { error?: string };

function validateName(formData: FormData): { name: string } | { error: string } {
  const raw = formData.get("name");
  const name = typeof raw === "string" ? raw.trim() : "";

  if (!name) {
    return { error: "폴더 이름을 입력해주세요." };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { error: `폴더 이름은 ${MAX_NAME_LENGTH}자 이내로 입력해주세요.` };
  }
  return { name };
}

export async function createFolder(
  formData: FormData,
): Promise<CreateFolderResult> {
  const checked = validateName(formData);
  if ("error" in checked) return checked;
  const { name } = checked;

  const supabase = createClient(await cookies());

  const { data: existing, error: selectError } = await supabase
    .from("folders")
    .select("id")
    .eq("name", name)
    .limit(1);
  if (selectError) {
    return { error: "폴더를 추가하지 못했어요. 잠시 후 다시 시도해주세요." };
  }
  if (existing.length > 0) {
    return { error: "이미 같은 이름의 폴더가 있어요." };
  }

  const { error } = await supabase.from("folders").insert({ name });
  if (error) {
    return { error: "폴더를 추가하지 못했어요. 잠시 후 다시 시도해주세요." };
  }

  // 사이드바(AppShell)가 모든 페이지에서 폴더 목록을 읽으므로 전체 레이아웃을 갱신한다.
  revalidatePath("/", "layout");
  return {};
}

export async function renameFolder(
  id: string,
  formData: FormData,
): Promise<CreateFolderResult> {
  const folderId = Number(id);
  if (!Number.isInteger(folderId)) {
    return { error: "존재하지 않는 폴더예요." };
  }

  const checked = validateName(formData);
  if ("error" in checked) return checked;
  const { name } = checked;

  const supabase = createClient(await cookies());

  const { data: duplicated, error: selectError } = await supabase
    .from("folders")
    .select("id")
    .eq("name", name)
    .neq("id", folderId)
    .limit(1);
  if (selectError) {
    return { error: "폴더 이름을 수정하지 못했어요. 잠시 후 다시 시도해주세요." };
  }
  if (duplicated.length > 0) {
    return { error: "이미 같은 이름의 폴더가 있어요." };
  }

  const { data: updated, error } = await supabase
    .from("folders")
    .update({ name })
    .eq("id", folderId)
    .select("id");
  if (error) {
    return { error: "폴더 이름을 수정하지 못했어요. 잠시 후 다시 시도해주세요." };
  }
  if (updated.length === 0) {
    return { error: "존재하지 않는 폴더예요." };
  }

  revalidatePath("/", "layout");
  return {};
}

export async function deleteFolder(id: string): Promise<CreateFolderResult> {
  const folderId = Number(id);
  if (!Number.isInteger(folderId)) {
    return { error: "이미 삭제되었거나 존재하지 않는 폴더예요." };
  }

  const supabase = createClient(await cookies());

  const { data: deleted, error } = await supabase
    .from("folders")
    .delete()
    .eq("id", folderId)
    .select("id");
  if (error) {
    return { error: "폴더를 삭제하지 못했어요. 잠시 후 다시 시도해주세요." };
  }
  if (deleted.length === 0) {
    return { error: "이미 삭제되었거나 존재하지 않는 폴더예요." };
  }

  revalidatePath("/", "layout");
  return {};
}
