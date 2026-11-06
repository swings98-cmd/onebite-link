import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Folder, LinkItem } from "./types";

/** folders 테이블의 모든 폴더를 추가한 순서대로 가져온다. */
export async function fetchFolders(): Promise<Folder[]> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("folders")
    .select("id, name")
    .order("id", { ascending: true });
  if (error) throw error;

  return data.map((folder) => ({
    id: String(folder.id),
    name: folder.name,
    // 폴더별 링크 개수는 집계하지 않는다.
    count: 0,
  }));
}

/** links 테이블의 전체 링크 개수 */
export async function fetchLinkCount(): Promise<number> {
  const supabase = createClient(await cookies());
  const { count, error } = await supabase
    .from("links")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

/** 링크를 최근에 추가한 순서로 가져온다. folderId가 있으면 그 폴더의 링크만 가져온다. */
export async function fetchLinks(folderId?: string): Promise<LinkItem[]> {
  const supabase = createClient(await cookies());
  let query = supabase
    .from("links")
    .select("id, url, title, description, thumbnail_url, folder_id")
    .order("id", { ascending: false });
  if (folderId !== undefined) query = query.eq("folder_id", Number(folderId));

  const { data, error } = await query;
  if (error) throw error;

  return data.map((link) => ({
    id: String(link.id),
    url: link.url,
    title: link.title ?? link.url,
    description: link.description ?? "",
    folderId: link.folder_id === null ? "" : String(link.folder_id),
    thumbnail: link.thumbnail_url ?? undefined,
  }));
}

/** 해당 id의 폴더가 folders 테이블에 있는지 확인한다. */
export async function folderExists(folderId: string): Promise<boolean> {
  const id = Number(folderId);
  if (!Number.isInteger(id)) return false;

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("folders")
    .select("id")
    .eq("id", id)
    .limit(1);
  if (error) throw error;
  return data.length > 0;
}
