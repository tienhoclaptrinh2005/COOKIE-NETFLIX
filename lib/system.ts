import { APP_DATA_KEY, appFields, appGet, cookiePoolCount, keyCount, pingRedis, redis } from "@/lib/redis";

const RESULT_KEYS = ["requests", "live", "die", "unknown"] as const;

export async function getSystemStats() {
  const [redisOnline, dailyLimit, quotaKeys, ...counts] = await Promise.all([
    pingRedis(),
    appGet<number>("cau_hinh:gioi_han_ngay"),
    appFields("han_muc_nhan:*", 1000),
    ...RESULT_KEYS.map((key) => appGet<number>(key === "requests" ? "thong_ke:tong" : `thong_ke:${key}`)),
  ]);

  const [requests, live, die, unknown] = counts.map((value) => Number(value) || 0);
  return {
    redisOnline,
    redisMode: redis ? "UPSTASH" : "MEMORY",
    dailyLimit: Number(dailyLimit) || 3,
    activeQuotaKeys: quotaKeys.length,
    requests,
    live,
    die,
    unknown,
  };
}

export async function getRedisOverview() {
  const definitions = [
    { pattern: "NetflixId", scope: "key" as const },
    { pattern: "VN", scope: "key" as const },
    { pattern: `${APP_DATA_KEY} → cau_hinh:*`, fieldPattern: "cau_hinh:*", scope: "field" as const },
    { pattern: `${APP_DATA_KEY} → thong_ke:*`, fieldPattern: "thong_ke:*", scope: "field" as const },
    { pattern: `${APP_DATA_KEY} → han_muc_nhan:*`, fieldPattern: "han_muc_nhan:*", scope: "field" as const },
    { pattern: `${APP_DATA_KEY} → nhan:*`, fieldPattern: "nhan:*", scope: "field" as const },
    { pattern: `${APP_DATA_KEY} → dang_nhap:*`, fieldPattern: "dang_nhap:*", scope: "field" as const },
    { pattern: `${APP_DATA_KEY} → truy_cap:*`, fieldPattern: "truy_cap:*", scope: "field" as const },
  ];
  const entries = await Promise.all(definitions.map(async (entry) => ({
    pattern: entry.pattern,
    count: entry.scope === "key"
      ? entry.pattern === "NetflixId" || entry.pattern === "VN"
        ? await cookiePoolCount(entry.pattern)
        : await keyCount(entry.pattern)
      : (await appFields(entry.fieldPattern, 5000)).length,
    scope: entry.scope,
  })));
  return { entries, online: await pingRedis(), mode: redis ? "UPSTASH" : "MEMORY" };
}
