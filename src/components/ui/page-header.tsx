"use client";

import Link from "next/link";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  rightAction?: React.ReactNode;
}

export function PageHeader({ title, backHref, rightAction }: PageHeaderProps) {
  return (
    <div className="px-4 pt-2 pb-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:bg-card active:bg-card-hover transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 4L13.5 10L7.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
