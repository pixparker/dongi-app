export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col items-center bg-bg">
      <main className="flex-1 flex flex-col w-full max-w-md min-h-0">{children}</main>
    </div>
  );
}
