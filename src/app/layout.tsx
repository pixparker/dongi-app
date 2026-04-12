import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "دنگی‌سفر",
  description: "مدیریت هزینه‌های سفر گروهی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable}`}>
      <body className="h-dvh flex flex-col font-sans bg-bg" suppressHydrationWarning>{children}</body>
    </html>
  );
}
