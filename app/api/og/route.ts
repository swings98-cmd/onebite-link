import { fetchOpenGraph, OpenGraphError } from "@/app/_lib/open-graph";

// GET /api/og?url=https://example.com
// → { url, title, description, image }
export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get("url");
  if (!target) {
    return Response.json({ error: "url 파라미터가 필요해요." }, { status: 400 });
  }

  try {
    return Response.json(await fetchOpenGraph(target));
  } catch (error) {
    if (error instanceof OpenGraphError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "알 수 없는 오류가 발생했어요." }, { status: 502 });
  }
}
