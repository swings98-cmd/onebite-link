"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import {
  fetchOpenGraph,
  OpenGraphError,
  parseHttpUrl,
  type OpenGraphData,
} from "../_lib/open-graph";

export type AddLinkResult = { error?: string; folderId?: string };

export async function addLink(formData: FormData): Promise<AddLinkResult> {
  const rawUrl = formData.get("url");
  const folderId = formData.get("folder");

  const parsed = typeof rawUrl === "string" ? parseHttpUrl(rawUrl) : null;
  if (!parsed) {
    return { error: "http:// 또는 https:// 로 시작하는 올바른 주소를 입력해주세요." };
  }

  const folderIdNumber = Number(folderId);
  if (typeof folderId !== "string" || !folderId || !Number.isInteger(folderIdNumber)) {
    return { error: "폴더를 선택해주세요." };
  }

  // 오픈 그래프 정보(제목·설명·썸네일)를 수집한다. (GET /api/og 와 같은 로직)
  let og: OpenGraphData;
  try {
    og = await fetchOpenGraph(parsed.href);
  } catch (error) {
    // 허용되지 않는 주소(내부망 등)는 저장하지 않는다.
    if (error instanceof OpenGraphError && error.status === 400) {
      return { error: error.message };
    }
    // 사이트가 응답하지 않거나 봇을 막은 경우에도 링크 자체는 저장한다.
    og = {
      url: parsed.href,
      title: parsed.hostname.replace(/^www\./, ""),
      description: "",
      image: null,
    };
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.from("links").insert({
    url: og.url,
    title: og.title,
    description: og.description,
    thumbnail_url: og.image,
    folder_id: folderIdNumber,
  });
  if (error) {
    // 23503: 선택한 폴더가 그 사이에 삭제된 경우(외래키 위반)
    return {
      error:
        error.code === "23503"
          ? "존재하지 않는 폴더예요."
          : "링크를 추가하지 못했어요. 잠시 후 다시 시도해주세요.",
    };
  }

  revalidatePath("/", "layout");
  return { folderId: String(folderIdNumber) };
}

export async function deleteLink(id: string): Promise<{ error?: string }> {
  const linkId = Number(id);
  if (!Number.isInteger(linkId)) {
    return { error: "이미 삭제되었거나 존재하지 않는 링크예요." };
  }

  const supabase = createClient(await cookies());
  const { data: deleted, error } = await supabase
    .from("links")
    .delete()
    .eq("id", linkId)
    .select("id");
  if (error) {
    return { error: "링크를 삭제하지 못했어요. 잠시 후 다시 시도해주세요." };
  }
  if (deleted.length === 0) {
    return { error: "이미 삭제되었거나 존재하지 않는 링크예요." };
  }

  revalidatePath("/", "layout");
  return {};
}

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 500;

export async function updateLink(
  id: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const linkId = Number(id);
  if (!Number.isInteger(linkId)) {
    return { error: "존재하지 않는 링크예요." };
  }

  const rawTitle = formData.get("title");
  const rawDescription = formData.get("description");
  const rawFolder = formData.get("folder");
  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
  const description =
    typeof rawDescription === "string" ? rawDescription.trim() : "";
  const folderId = typeof rawFolder === "string" ? Number(rawFolder) : NaN;

  if (!title) return { error: "제목을 입력해주세요." };
  if (title.length > MAX_TITLE_LENGTH) {
    return { error: `제목은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요.` };
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      error: `설명은 ${MAX_DESCRIPTION_LENGTH}자 이내로 입력해주세요.`,
    };
  }
  if (!rawFolder || !Number.isInteger(folderId)) {
    return { error: "폴더를 선택해주세요." };
  }

  const supabase = createClient(await cookies());
  const { data: updated, error } = await supabase
    .from("links")
    .update({ title, description, folder_id: folderId })
    .eq("id", linkId)
    .select("id");
  if (error) {
    // 23503: 선택한 폴더가 그 사이에 삭제된 경우(외래키 위반)
    return {
      error:
        error.code === "23503"
          ? "존재하지 않는 폴더예요."
          : "링크를 수정하지 못했어요. 잠시 후 다시 시도해주세요.",
    };
  }
  if (updated.length === 0) {
    return { error: "존재하지 않는 링크예요." };
  }

  revalidatePath("/", "layout");
  return {};
}
