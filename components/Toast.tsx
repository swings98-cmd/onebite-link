"use client";

import { useEffect } from "react";

type Props = {
  message: string;
  onClose: () => void;
};

const DURATION_MS = 4000;

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, DURATION_MS);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        role="alert"
        className="pointer-events-auto rounded-[6px] bg-[var(--error)] px-4 py-2 text-sm font-medium text-white"
      >
        {message}
      </div>
    </div>
  );
}
