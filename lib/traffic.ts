import "server-only";
import {
  appDeleteFields,
  appFields,
  appGet,
  appIncr,
  appSet,
  appSetIfAbsent,
} from "@/lib/redis";
import { hashIdentifier } from "@/lib/request";

export const TRACKED_PUBLIC_PATHS = ["/", "/receive", "/login"] as const;
export type TrackedPublicPath = (typeof TRACKED_PUBLIC_PATHS)[number];

const pathFields: Record<TrackedPublicPath, string> = {
  "/": "trang_chu",
  "/receive": "nhan_token",
  "/login": "dang_nhap",
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_RETENTION_SECONDS = 120 * 24 * 60 * 60;
const DAILY_VISITOR_TTL_SECONDS = 3 * 24 * 60 * 60;
const ACTIVE_WINDOW_SECONDS = 5 * 60;
const EVENT_DEDUPE_SECONDS = 10 * 60;
const RATE_LIMIT_WINDOW_SECONDS = 2 * 60;
const MAX_TRACKING_EVENTS_PER_MINUTE = 60;

const ictDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function dateKey(date: Date) {
  const parts = Object.fromEntries(
    ictDateFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function dayKeys(now: Date, amount: number) {
  return Array.from({ length: amount }, (_, index) =>
    dateKey(new Date(now.getTime() - (amount - index - 1) * DAY_MS)),
  );
}

function numberValue(value: number | string | null) {
  return Number(value) || 0;
}

export function isLikelyBot(userAgent: string | null) {
  if (!userAgent) return true;
  return /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|discordbot|headless|lighthouse|pagespeed/i.test(
    userAgent,
  );
}

export type VisitRecordResult = "recorded" | "duplicate" | "rate-limited";

export async function recordPublicVisit({
  path,
  eventId,
  visitorId,
  ip,
  now = new Date(),
}: {
  path: TrackedPublicPath;
  eventId: string;
  visitorId: string;
  ip: string;
  now?: Date;
}): Promise<VisitRecordResult> {
  const visitorHash = hashIdentifier(`visitor:${visitorId}`);
  const eventField = `truy_cap:su_kien:${hashIdentifier(`${visitorId}:${eventId}`)}`;
  const firstDelivery = await appSetIfAbsent(eventField, 1, EVENT_DEDUPE_SECONDS);
  if (!firstDelivery) return "duplicate";

  const minute = Math.floor(now.getTime() / 60_000);
  const rateField = `truy_cap:gioi_han:${minute}:${hashIdentifier(ip)}`;
  const eventCount = await appIncr(rateField, RATE_LIMIT_WINDOW_SECONDS);
  if (eventCount > MAX_TRACKING_EVENTS_PER_MINUTE) {
    await appDeleteFields(eventField);
    return "rate-limited";
  }

  const day = dateKey(now);
  const uniqueMarker = `truy_cap:ngay:${day}:khach:${visitorHash}`;
  const isNewVisitor = await appSetIfAbsent(
    uniqueMarker,
    1,
    DAILY_VISITOR_TTL_SECONDS,
  );

  const writes: Promise<unknown>[] = [
    appIncr("truy_cap:tong"),
    appIncr(`truy_cap:ngay:${day}:luot_xem`, DAILY_RETENTION_SECONDS),
    appIncr(
      `truy_cap:ngay:${day}:trang:${pathFields[path]}`,
      DAILY_RETENTION_SECONDS,
    ),
    appSet(
      `truy_cap:hoat_dong:${visitorHash}`,
      now.getTime(),
      ACTIVE_WINDOW_SECONDS,
    ),
  ];
  if (isNewVisitor) {
    writes.push(
      appIncr(`truy_cap:ngay:${day}:khach_duy_nhat`, DAILY_RETENTION_SECONDS),
    );
  }
  await Promise.all(writes);
  return "recorded";
}

export type TrafficDay = {
  date: string;
  pageViews: number;
  estimatedVisitors: number;
};

export type TrafficPage = {
  path: TrackedPublicPath;
  pageViews: number;
};

export type TrafficStats = {
  todayPageViews: number;
  todayEstimatedVisitors: number;
  activeVisitors: number;
  totalPageViews: number;
  days: TrafficDay[];
  topPages: TrafficPage[];
};

export async function getTrafficStats(now = new Date()): Promise<TrafficStats> {
  const days = dayKeys(now, 7);
  const [totalPageViews, activeFields, dailyStats, pageTotals] = await Promise.all([
    appGet<number>("truy_cap:tong"),
    appFields("truy_cap:hoat_dong:*", 5000),
    Promise.all(
      days.map(async (day) => {
        const [pageViews, estimatedVisitors] = await Promise.all([
          appGet<number>(`truy_cap:ngay:${day}:luot_xem`),
          appGet<number>(`truy_cap:ngay:${day}:khach_duy_nhat`),
        ]);
        return {
          date: day,
          pageViews: numberValue(pageViews),
          estimatedVisitors: numberValue(estimatedVisitors),
        };
      }),
    ),
    Promise.all(
      TRACKED_PUBLIC_PATHS.map(async (path) => {
        const values = await Promise.all(
          days.map((day) =>
            appGet<number>(`truy_cap:ngay:${day}:trang:${pathFields[path]}`),
          ),
        );
        return {
          path,
          pageViews: values.reduce<number>(
            (sum, value) => sum + numberValue(value),
            0,
          ),
        };
      }),
    ),
  ]);

  const today = dailyStats.at(-1) ?? {
    date: dateKey(now),
    pageViews: 0,
    estimatedVisitors: 0,
  };

  return {
    todayPageViews: today.pageViews,
    todayEstimatedVisitors: today.estimatedVisitors,
    activeVisitors: activeFields.length,
    totalPageViews: numberValue(totalPageViews),
    days: dailyStats,
    topPages: pageTotals.sort((left, right) => right.pageViews - left.pageViews),
  };
}
