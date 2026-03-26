import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-2xl p-4 border border-border",
        onClick && "cursor-pointer hover:bg-card-hover active:scale-[0.99] transition-all",
        className,
      )}
    >
      {children}
    </div>
  );
}
