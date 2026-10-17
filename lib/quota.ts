import { appAdjust, appGet, appIncr } from "@/lib/redis";
import { hashIdentifier } from "@/lib/request";

const DEFAULT_LIMIT = 3;

function dateKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function secondsUntilReset() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  const elapsed = get("hour") * 3600 + get("minute") * 60 + get("second");
  return Math.max(60, 86_400 - elapsed + 300);
}

export async function getDailyLimit() {
  const configured = Number(await appGet("cau_hinh:gioi_han_ngay"));
  return Number.isInteger(configured) && configured >= 1 && configured <= 100 ? configured : DEFAULT_LIMIT;
}

export async function quotaForIp(ip: string) {
  const limit = await getDailyLimit();
  const key = `han_muc_nhan:${dateKey()}:${hashIdentifier(ip)}`;
  const used = Math.max(0, Number(await appGet(key)) || 0);
  return { key, limit, used, remaining: Math.max(0, limit - used) };
}

export async function consumeQuota(ip: string) {
  const quota = await quotaForIp(ip);
  if (quota.remaining <= 0) return { ...quota, allowed: false };
  const used = await appIncr(quota.key, secondsUntilReset());
  if (used > quota.limit) {
    await appAdjust(quota.key, -1);
    return { ...quota, used: quota.limit, remaining: 0, allowed: false };
  }
  return {
    ...quota,
    used,
    remaining: Math.max(0, quota.limit - used),
    allowed: true,
  };
}

export async function refundQuota(ip: string) {
  const quota = await quotaForIp(ip);
  if (quota.used <= 0) return quota;
  const used = await appAdjust(quota.key, -1);
  return { ...quota, used, remaining: Math.max(0, quota.limit - used) };
}
