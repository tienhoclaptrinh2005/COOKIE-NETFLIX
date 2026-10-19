import { Redis } from "@upstash/redis";

type MemoryField = { value: string; expiresAt?: number };

declare global {
  var __pixelPressHashMemory: Map<string, MemoryField> | undefined;
}

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;
export const APP_DATA_KEY = "pixel_press";
export const COOKIE_POOLS = ["VN", "NetflixId"] as const;
export type CookiePool = (typeof COOKIE_POOLS)[number];

const memory = globalThis.__pixelPressHashMemory ?? new Map<string, MemoryField>();
if (process.env.NODE_ENV !== "production") globalThis.__pixelPressHashMemory = memory;

function cleanMemoryField(field: string) {
  const entry = memory.get(field);
  if (entry?.expiresAt && entry.expiresAt <= Date.now()) memory.delete(field);
}

function matchesPattern(value: string, pattern: string) {
  const escaped = pattern.replace(/[.+?^$\{\}()|[\]\\]/g, "\\$&").replaceAll("*", ".*");
  return new RegExp(`^${escaped}$`).test(value);
}

export async function appGet<T = string>(field: string): Promise<T | null> {
  if (redis) return redis.hget<T>(APP_DATA_KEY, field);
  cleanMemoryField(field);
  const entry = memory.get(field);
  if (!entry) return null;
  try {
    return JSON.parse(entry.value) as T;
  } catch {
    return entry.value as T;
  }
}

export async function appSet(field: string, value: string | number, ttlSeconds?: number) {
  if (redis) {
    const result = await redis.hset(APP_DATA_KEY, { [field]: value });
    if (ttlSeconds) await redis.hexpire(APP_DATA_KEY, field, ttlSeconds);
    return result;
  }
  memory.set(field, {
    value: JSON.stringify(value),
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
  });
  return 1;
}

export async function appSetIfAbsent(field: string, value: string | number, ttlSeconds?: number) {
  if (redis) {
    const created = await redis.hsetnx(APP_DATA_KEY, field, value);
    if (created === 1 && ttlSeconds) await redis.hexpire(APP_DATA_KEY, field, ttlSeconds);
    return created === 1;
  }
  cleanMemoryField(field);
  if (memory.has(field)) return false;
  memory.set(field, {
    value: JSON.stringify(value),
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
  });
  return true;
}

export async function appIncr(field: string, ttlSeconds?: number) {
  if (redis) {
    const value = await redis.hincrby(APP_DATA_KEY, field, 1);
    if (ttlSeconds) await redis.hexpire(APP_DATA_KEY, field, ttlSeconds);
    return value;
  }
  cleanMemoryField(field);
  const current = Number(await appGet(field)) || 0;
  await appSet(field, current + 1, ttlSeconds);
  return current + 1;
}

export async function appAdjust(field: string, amount: number, ttlSeconds?: number) {
  if (!Number.isInteger(amount)) throw new Error("Redis adjustment must be an integer.");
  if (redis) {
    const value = await redis.hincrby(APP_DATA_KEY, field, amount);
    if (ttlSeconds) await redis.hexpire(APP_DATA_KEY, field, ttlSeconds);
    if (value <= 0) {
      await redis.hdel(APP_DATA_KEY, field);
      return 0;
    }
    return value;
  }
  cleanMemoryField(field);
  const current = Number(await appGet(field)) || 0;
  const next = Math.max(0, current + amount);
  if (next === 0) {
    memory.delete(field);
    return 0;
  }
  await appSet(field, next, ttlSeconds);
  return next;
}

export type CookieCandidate = { pool: CookiePool; cookie: string };

export async function sampleCookieCandidates(limit: number): Promise<CookieCandidate[]> {
  if (!redis || limit <= 0) return [];
  const requested = Math.max(0, Math.floor(limit));
  const firstPoolIndex = Math.random() < 0.5 ? 0 : 1;
  const orderedPools = [COOKIE_POOLS[firstPoolIndex], COOKIE_POOLS[1 - firstPoolIndex]] as const;
  const available = new Map<CookiePool, number>(await Promise.all(
    COOKIE_POOLS.map(async (pool) => [pool, await redis.scard(pool)] as const),
  ));

  // Build an alternating schedule. If either Set is empty (or runs out), all
  // remaining slots are assigned to the other Set.
  const schedule: CookiePool[] = [];
  let turn = 0;
  while (schedule.length < requested) {
    const preferred = orderedPools[turn % orderedPools.length];
    const fallback = orderedPools[(turn + 1) % orderedPools.length];
    const pool = (available.get(preferred) ?? 0) > 0
      ? preferred
      : (available.get(fallback) ?? 0) > 0
        ? fallback
        : null;
    if (!pool) break;
    schedule.push(pool);
    available.set(pool, (available.get(pool) ?? 0) - 1);
    turn += 1;
  }

  const requestedByPool = new Map<CookiePool, number>(COOKIE_POOLS.map((pool) => [pool, 0]));
  for (const pool of schedule) requestedByPool.set(pool, (requestedByPool.get(pool) ?? 0) + 1);

  const sampledByPool = new Map<CookiePool, string[]>();
  await Promise.all(COOKIE_POOLS.map(async (pool) => {
    const count = requestedByPool.get(pool) ?? 0;
    if (count <= 0) {
      sampledByPool.set(pool, []);
      return;
    }
    const sampled = await redis.srandmember<string[]>(pool, count);
    const values = (Array.isArray(sampled) ? sampled : sampled ? [String(sampled)] : [])
      .filter((cookie): cookie is string => typeof cookie === "string" && cookie.length >= 16);
    sampledByPool.set(pool, values);
  }));

  return schedule.flatMap((pool) => {
    const cookie = sampledByPool.get(pool)?.shift();
    return cookie ? [{ pool, cookie }] : [];
  });
}

export async function removeCookieCandidate(candidate: CookieCandidate) {
  if (!redis) return 0;
  return redis.srem(candidate.pool, candidate.cookie);
}

export async function cookiePoolCount(pool: CookiePool) {
  if (!redis) return 0;
  return redis.scard(pool);
}

export async function appDeleteFields(...fields: string[]) {
  if (!fields.length) return 0;
  if (redis) return redis.hdel(APP_DATA_KEY, ...fields);
  let removed = 0;
  for (const field of fields) {
    if (memory.delete(field)) removed += 1;
  }
  return removed;
}

export async function appFields(pattern = "*", count = 1000) {
  if (!redis) {
    for (const field of memory.keys()) cleanMemoryField(field);
    return Array.from(memory.keys()).filter((field) => matchesPattern(field, pattern)).slice(0, count);
  }

  const fields: string[] = [];
  let cursor = "0";
  do {
    const [next, batch] = await redis.hscan(APP_DATA_KEY, cursor, {
      match: pattern,
      count: Math.min(count, 500),
    });
    cursor = String(next);
    for (let index = 0; index < batch.length; index += 2) fields.push(String(batch[index]));
  } while (cursor !== "0" && fields.length < count);
  return fields.slice(0, count);
}

export async function appDeletePattern(pattern: string) {
  const fields = await appFields(pattern, 5000);
  return fields.length ? appDeleteFields(...fields) : 0;
}

export async function keyCount(pattern: string, count = 100) {
  if (!redis) return pattern === APP_DATA_KEY && memory.size > 0 ? 1 : 0;
  const keys: string[] = [];
  let cursor = "0";
  do {
    const [next, batch] = await redis.scan(cursor, { match: pattern, count: Math.min(count, 100) });
    cursor = String(next);
    keys.push(...batch);
  } while (cursor !== "0" && keys.length < count);
  return keys.slice(0, count).length;
}

export async function pingRedis() {
  if (!redis) return false;
  try {
    return (await redis.ping()) === "PONG";
  } catch {
    return false;
  }
}
