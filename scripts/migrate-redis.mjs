import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.error("Thiếu UPSTASH_REDIS_REST_URL hoặc UPSTASH_REDIS_REST_TOKEN.");
  process.exit(1);
}

const redis = new Redis({ url, token });
const targetKey = "pixel_press";
const groups = [
  { pattern: "config:daily_limit", map: () => "cau_hinh:gioi_han_ngay", mode: "keep" },
  { pattern: "stats:*", map: (key) => key === "stats:requests" ? "thong_ke:tong" : key.replace("stats:", "thong_ke:"), mode: "sum" },
  { pattern: "quota:*", map: (key) => key.replace("quota:", "han_muc:"), mode: "max" },
  { pattern: "auth:attempt:*", map: (key) => key.replace("auth:attempt:", "dang_nhap:that_bai:"), mode: "max" },
];

async function scan(pattern) {
  const keys = [];
  let cursor = "0";
  do {
    const [next, batch] = await redis.scan(cursor, { match: pattern, count: 100 });
    cursor = String(next);
    keys.push(...batch);
  } while (cursor !== "0");
  return keys;
}

let migrated = 0;

for (const group of groups) {
  const keys = await scan(group.pattern);
  for (const sourceKey of keys) {
    const sourceValue = await redis.get(sourceKey);
    if (sourceValue === null) continue;

    const field = group.map(sourceKey);
    const currentValue = await redis.hget(targetKey, field);
    let nextValue = sourceValue;
    if (currentValue !== null && group.mode === "sum") nextValue = Number(currentValue) + Number(sourceValue);
    if (currentValue !== null && group.mode === "max") nextValue = Math.max(Number(currentValue), Number(sourceValue));
    if (currentValue !== null && group.mode === "keep") nextValue = currentValue;

    await redis.hset(targetKey, { [field]: nextValue });
    const ttl = await redis.ttl(sourceKey);
    if (ttl > 0) await redis.hexpire(targetKey, field, ttl);
    await redis.del(sourceKey);
    migrated += 1;
  }
}

console.log(`Đã chuyển ${migrated} key cũ vào Redis Hash ${targetKey}.`);
