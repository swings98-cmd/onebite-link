export type Folder = {
  id: string;
  name: string;
  count: number;
};

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  description: string;
  folderId: string;
  /** 오픈 그래프 이미지(썸네일). 없을 수 있다. */
  thumbnail?: string;
};
