import { z } from "zod";
import { appGet, appSet } from "@/lib/redis";

export const ANNOUNCEMENT_FIELD = "cau_hinh:thong_bao_popup";
export const announcementIcons = [
  "megaphone",
  "info",
  "gift",
  "shield",
  "link",
] as const;

const localizedContentSchema = z
  .object({
    title: z.string().trim().min(1).max(100),
    message: z.string().trim().min(1).max(1200),
    linkLabel: z.string().trim().max(80),
  })
  .strict();

function isSafeLink(value: string) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const announcementConfigSchema = z
  .object({
    enabled: z.boolean(),
    icon: z.enum(announcementIcons),
    vi: localizedContentSchema,
    en: localizedContentSchema,
    linkUrl: z.string().trim().max(2048).refine(isSafeLink),
    openInNewTab: z.boolean(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.linkUrl && (!value.vi.linkLabel || !value.en.linkLabel)) {
      context.addIssue({
        code: "custom",
        message: "Link labels are required when a link URL is configured.",
        path: ["linkUrl"],
      });
    }
  });

export type AnnouncementConfig = z.infer<typeof announcementConfigSchema>;

export const defaultAnnouncementConfig: AnnouncementConfig = {
  enabled: true,
  icon: "megaphone",
  vi: {
    title: "THÔNG BÁO HỆ THỐNG",
    message:
      "Chào mừng bạn đến với VMT SHOP. Cookie được xử lý phía máy chủ và không bao giờ được hiển thị lại.",
    linkLabel: "",
  },
  en: {
    title: "SYSTEM NOTICE",
    message:
      "Welcome to VMT SHOP. Cookies are processed server-side and are never displayed back to you.",
    linkLabel: "",
  },
  linkUrl: "",
  openInNewTab: false,
};

export async function getAnnouncementConfig(): Promise<AnnouncementConfig> {
  const stored = await appGet<AnnouncementConfig | string>(ANNOUNCEMENT_FIELD);
  if (!stored) return defaultAnnouncementConfig;
  try {
    const candidate = typeof stored === "string" ? JSON.parse(stored) : stored;
    const parsed = announcementConfigSchema.safeParse(candidate);
    return parsed.success ? parsed.data : defaultAnnouncementConfig;
  } catch {
    return defaultAnnouncementConfig;
  }
}

export async function saveAnnouncementConfig(config: AnnouncementConfig) {
  const parsed = announcementConfigSchema.parse(config);
  await appSet(ANNOUNCEMENT_FIELD, JSON.stringify(parsed));
  return parsed;
}
