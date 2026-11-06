"use server";

import { revalidatePath } from "next/cache";
import {
  fetchOpenGraph,
  OpenGraphError,
  parseHttpUrl,
  type OpenGraphData,
} from "../_lib/open-graph";
import { folders, links } from "../_lib/mock-data";

export type AddLinkResult = { error?: string; folderId?: string };

export async function addLink(formData: FormData): Promise<AddLinkResult> {
  const rawUrl = formData.get("url");
  const folderId = formData.get("folder");

  const parsed = typeof rawUrl === "string" ? parseHttpUrl(rawUrl) : null;
  if (!parsed) {
    return { error: "http:// 또는 https:// 로 시작하는 올바른 주소를 입력해주세요." };
  }

  const folder = folders.find((f) => f.id === folderId);
  if (!folder) {
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

  links.unshift({
    id: crypto.randomUUID(),
    title: og.title,
    url: og.url,
    description: og.description,
    thumbnail: og.image ?? undefined,
    folderId: folder.id,
  });
  folder.count += 1;

  revalidatePath("/", "layout");
  return { folderId: folder.id };
}

export async function deleteLink(id: string): Promise<{ error?: string }> {
  const index = links.findIndex((link) => link.id === id);
  if (index === -1) {
    return { error: "이미 삭제되었거나 존재하지 않는 링크예요." };
  }

  const [removed] = links.splice(index, 1);
  const folder = folders.find((f) => f.id === removed.folderId);
  if (folder) folder.count = Math.max(0, folder.count - 1);

  revalidatePath("/", "layout");
  return {};
}
