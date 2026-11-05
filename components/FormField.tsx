import type { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor: string;
  children: ReactNode;
};

export default function FormField({ label, htmlFor, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-[var(--text)]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
