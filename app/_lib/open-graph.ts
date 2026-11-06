import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export type OpenGraphData = {
  url: string;
  title: string;
  description: string;
  image: string | null;
};

export class OpenGraphError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 502,
  ) {
    super(message);
  }
}

const FETCH_TIMEOUT_MS = 5000;
const MAX_BODY_BYTES = 512 * 1024;
const MAX_REDIRECTS = 3;

/** 사용자가 입력한 문자열을 http(s) URL로 파싱한다. 아니면 null. */
export function parseHttpUrl(input: string): URL | null {
  try {
    const url = new URL(input.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

// ---------- SSRF 방어: 내부망/로컬 주소로는 요청하지 않는다 ----------

function isPrivateIPv4(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateIp(ip: string): boolean {
  if (isIP(ip) === 4) return isPrivateIPv4(ip);
  const v6 = ip.toLowerCase();
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIPv4(mapped[1]);
  return (
    v6 === "::" ||
    v6 === "::1" ||
    v6.startsWith("fc") ||
    v6.startsWith("fd") ||
    v6.startsWith("fe8") ||
    v6.startsWith("fe9") ||
    v6.startsWith("fea") ||
    v6.startsWith("feb")
  );
}

async function assertPublicHost(url: URL) {
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost")) {
    throw new OpenGraphError("허용되지 않는 주소예요.", 400);
  }
  const addresses = isIP(host)
    ? [{ address: host }]
    : await lookup(host, { all: true }).catch(() => {
        throw new OpenGraphError("주소를 찾을 수 없어요.", 502);
      });
  if (addresses.some(({ address }) => isPrivateIp(address))) {
    throw new OpenGraphError("허용되지 않는 주소예요.", 400);
  }
}

// ---------- HTML 가져오기 ----------

async function fetchHtml(startUrl: URL): Promise<{ html: string; finalUrl: URL }> {
  let current = startUrl;

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertPublicHost(current);

    const res = await fetch(current, {
      redirect: "manual", // 리다이렉트 대상도 매번 검증하기 위해 직접 따라간다
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; OnebiteLinkBot/1.0)",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "ko,en;q=0.8",
      },
    }).catch(() => {
      throw new OpenGraphError("페이지를 불러오지 못했어요.", 502);
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      const next = location && parseHttpUrl(new URL(location, current).href);
      if (!next) throw new OpenGraphError("페이지를 불러오지 못했어요.", 502);
      current = next;
      continue;
    }

    if (!res.ok) throw new OpenGraphError("페이지를 불러오지 못했어요.", 502);

    const type = res.headers.get("content-type") ?? "";
    if (!/html|xml/i.test(type)) {
      throw new OpenGraphError("웹 페이지가 아니에요.", 502);
    }

    const charset = type.match(/charset=([^;]+)/i)?.[1]?.trim() ?? "utf-8";
    const html = await readLimited(res, charset);
    return { html, finalUrl: current };
  }

  throw new OpenGraphError("리다이렉트가 너무 많아요.", 502);
}

/** <head> 정보만 필요하므로 본문은 일정 크기까지만 읽는다. */
async function readLimited(res: Response, charset: string): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";

  let decoder: TextDecoder;
  try {
    decoder = new TextDecoder(charset);
  } catch {
    decoder = new TextDecoder("utf-8");
  }

  let received = 0;
  let text = "";
  while (received < MAX_BODY_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    text += decoder.decode(value, { stream: true });
    if (/<\/head\s*>/i.test(text)) break;
  }
  await reader.cancel().catch(() => {});
  return text;
}

// ---------- HTML 파싱 ----------

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => safeFromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => safeFromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

function safeFromCodePoint(code: number): string {
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const m of tag.matchAll(re)) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

function collectMeta(html: string): Map<string, string> {
  const head = html.split(/<\/head\s*>/i)[0];
  const meta = new Map<string, string>();
  for (const m of head.matchAll(/<meta\s+([^>]*?)\/?>/gi)) {
    const attrs = parseAttributes(m[1]);
    const key = (attrs.property ?? attrs.name)?.toLowerCase();
    if (key && attrs.content && !meta.has(key)) meta.set(key, attrs.content.trim());
  }
  return meta;
}

function resolveImage(value: string | undefined, base: URL): string | null {
  if (!value) return null;
  try {
    const resolved = new URL(value, base);
    return resolved.protocol === "http:" || resolved.protocol === "https:"
      ? resolved.href
      : null;
  } catch {
    return null;
  }
}

export async function fetchOpenGraph(input: string): Promise<OpenGraphData> {
  const target = parseHttpUrl(input);
  if (!target) {
    throw new OpenGraphError("http:// 또는 https:// 로 시작하는 주소를 입력해주세요.", 400);
  }

  const { html, finalUrl } = await fetchHtml(target);
  const meta = collectMeta(html);
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];

  const title =
    meta.get("og:title") ??
    meta.get("twitter:title") ??
    (titleTag ? decodeEntities(titleTag).replace(/\s+/g, " ").trim() : "");
  const description =
    meta.get("og:description") ??
    meta.get("twitter:description") ??
    meta.get("description") ??
    "";
  const image = resolveImage(
    meta.get("og:image") ?? meta.get("twitter:image"),
    finalUrl,
  );

  return {
    // og:url 은 신뢰하지 않고, 사용자가 입력한 주소를 그대로 저장한다.
    url: target.href,
    title: title || target.hostname.replace(/^www\./, ""),
    description,
    image,
  };
}
