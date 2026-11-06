"use client";

import { useState } from "react";

type Props = {
  src: string;
};

/** 썸네일 이미지. 불러오기에 실패하면 영역 자체를 숨긴다. */
export default function LinkThumbnail({ src }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <div className="aspect-[1.91/1] w-full overflow-hidden rounded-[6px] bg-[var(--hover-bg)]">
      {/* 외부 도메인이 제각각이라 next/image 대신 <img> 를 쓴다 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
