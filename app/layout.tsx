import type { Metadata, Viewport } from "next";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteAnnouncement } from "@/components/site-announcement";
import { getAnnouncementConfig } from "@/lib/announcement";
import { getAdminSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VMT SHOP — Session Analyzer",
    template: "%s // VMT SHOP ",
  },
  description:
    "A privacy-first retro arcade session analyzer and admin control center.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#040814",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [locale, session] = await Promise.all([getLocale(), getAdminSession()]);
  const copy = getDictionary(locale);
  const announcement = session ? null : await getAnnouncementConfig();
  return (
    <html lang={locale}>
      <body>
        <I18nProvider initialLocale={locale}>
          <a className="skip-link" href="#main-content">
            {copy.skipToMain}
          </a>
          {children}
          {announcement?.enabled && <SiteAnnouncement config={announcement} />}
        </I18nProvider>
      </body>
    </html>
  );
}
