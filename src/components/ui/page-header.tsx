"use client";

import Link from "next/link";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  rightAction?: React.ReactNode;
}

export function PageHeader({ title, backHref, rightAction }: PageHeaderProps) {
  return (
    <div className="px-5 pt-2 pb-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="text-accent text-xl leading-none p-1"
          >
            →
          </Link>
        )}
        <h1 className="text-[22px] font-extrabold text-text-primary tracking-tight m-0">
          {title}
        </h1>
      </div>
      {rightAction}
    </div>
  );
}
