import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toLatinNumber(s: string): string {
  let result = s;
  PERSIAN_DIGITS.forEach((d, i) => {
    result = result.replaceAll(d, String(i));
  });
  ARABIC_DIGITS.forEach((d, i) => {
    result = result.replaceAll(d, String(i));
  });
  return result;
}

export function toPersianNumber(n: number | string): string {
  return String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d)]);
}

export function formatCurrency(amount: number, currency?: string): string {
  const formatted = toPersianNumber(amount.toLocaleString());
  return currency ? `${formatted} ${currency}` : formatted;
}

const RELATIVE_UNITS: [number, string][] = [
  [60, "ثانیه"],
  [3600, "دقیقه"],
  [86400, "ساعت"],
  [2592000, "روز"],
  [31536000, "ماه"],
];

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  if (seconds < 60) return "لحظاتی پیش";

  for (let i = RELATIVE_UNITS.length - 1; i >= 0; i--) {
    const [threshold, unit] = RELATIVE_UNITS[i];
    if (seconds >= threshold) {
      const prevThreshold = i > 0 ? RELATIVE_UNITS[i - 1][0] : 1;
      const value = Math.floor(seconds / prevThreshold);
      return `${toPersianNumber(value)} ${unit} پیش`;
    }
  }

  return "لحظاتی پیش";
}
