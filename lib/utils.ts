import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function maskIp(ip: string) {
  if (ip.includes(":")) {
    const blocks = ip.split(":").filter(Boolean);
    return `${blocks.slice(0, 2).join(":")}:••••:••••`;
  }
  const blocks = ip.split(".");
  return blocks.length === 4 ? `${blocks[0]}.${blocks[1]}.•••.•••` : "HIDDEN";
}
