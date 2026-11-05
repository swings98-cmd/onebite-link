import type { Folder, LinkItem } from "./types";

export const folders: Folder[] = [
  { id: "dev", name: "개발", count: 4 },
  { id: "design", name: "디자인", count: 3 },
  { id: "read", name: "읽을거리", count: 3 },
  { id: "etc", name: "기타", count: 2 },
];

export const links: LinkItem[] = [
  {
    id: "1",
    title: "Next.js 공식 문서",
    url: "https://nextjs.org/docs",
    description: "App Router, 서버 컴포넌트 등 Next.js의 모든 것.",
    folderId: "dev",
  },
  {
    id: "2",
    title: "React 공식 문서",
    url: "https://react.dev",
    description: "React 19의 새로운 기능과 가이드를 확인할 수 있어요.",
    folderId: "dev",
  },
  {
    id: "3",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "유틸리티 퍼스트 CSS 프레임워크.",
    folderId: "dev",
  },
  {
    id: "4",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "웹 기술에 대한 신뢰할 수 있는 레퍼런스.",
    folderId: "dev",
  },
  {
    id: "5",
    title: "Figma",
    url: "https://figma.com",
    description: "협업 기반 인터페이스 디자인 도구.",
    folderId: "design",
  },
  {
    id: "6",
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "디자이너들의 작업물을 구경하며 영감을 얻는 곳.",
    folderId: "design",
  },
  {
    id: "7",
    title: "Refactoring UI",
    url: "https://refactoringui.com",
    description: "개발자를 위한 실전 UI 디자인 팁 모음.",
    folderId: "design",
  },
  {
    id: "8",
    title: "Hacker News",
    url: "https://news.ycombinator.com",
    description: "개발 및 스타트업 관련 최신 소식.",
    folderId: "read",
  },
  {
    id: "9",
    title: "Velog",
    url: "https://velog.io",
    description: "개발자들을 위한 블로그 플랫폼.",
    folderId: "read",
  },
  {
    id: "10",
    title: "GeekNews",
    url: "https://news.hada.io",
    description: "개발/기술/스타트업 뉴스를 한국어로.",
    folderId: "read",
  },
  {
    id: "11",
    title: "Google Calendar",
    url: "https://calendar.google.com",
    description: "일정 관리.",
    folderId: "etc",
  },
  {
    id: "12",
    title: "Notion",
    url: "https://notion.so",
    description: "메모와 문서를 한곳에서 관리.",
    folderId: "etc",
  },
];
