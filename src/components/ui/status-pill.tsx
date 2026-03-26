interface StatusPillProps {
  label: string;
  color: string;
  bgColor: string;
}

export function StatusPill({ label, color, bgColor }: StatusPillProps) {
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide"
      style={{ color, background: bgColor }}
    >
      {label}
    </span>
  );
}
