import { Clock3, InfinityIcon, LockKeyhole, ShieldCheck } from "lucide-react";
import { AdminHeader } from "@/components/admin-header";
import { AnnouncementSettings } from "@/components/announcement-settings";
import { QuotaSettings } from "@/components/quota-settings";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { getAnnouncementConfig } from "@/lib/announcement";
import { getDailyLimit } from "@/lib/quota";
import { getServerDictionary } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Guest Settings" };

export default async function SettingsPage() {
  const copy = await getServerDictionary();
  const [limit, announcement] = await Promise.all([getDailyLimit(), getAnnouncementConfig()]);
  return (
    <main id="main-content" tabIndex={-1}>
      <AdminHeader title={copy.settingsTitle} description={copy.settingsDescription} />
      <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <PixelPanel title={copy.announcementSettingsTitle} eyebrow={copy.announcementSettingsEyebrow} accent="violet"><div className="p-5 sm:p-6"><AnnouncementSettings initialConfig={announcement} /></div></PixelPanel>
        <div className="grid gap-6 lg:grid-cols-[1fr_.72fr]">
          <PixelPanel title={copy.settingsGuestQuota} eyebrow={copy.settingsRuntime} accent="yellow"><div className="p-5 sm:p-6"><QuotaSettings initialLimit={limit} /></div></PixelPanel>
          <div className="space-y-6">
            <PixelPanel title={copy.settingsAdminPolicy} eyebrow={copy.settingsPermissions} accent="green"><div className="space-y-4 p-5"><div className="flex items-center gap-4 border-2 border-primary bg-[#062116] p-4"><InfinityIcon aria-hidden="true" className="size-8 text-primary" /><div><p className="font-pixel text-[9px]">{copy.settingsUnlimited}</p><p className="text-lg text-muted">{copy.settingsExempt}</p></div></div><div className="flex gap-3 text-muted"><ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-blue" /><p>{copy.settingsAdminLimits}</p></div></div></PixelPanel>
            <PixelPanel title={copy.settingsSecurityRules} eyebrow={copy.settingsServerEnforced} accent="red"><ul className="space-y-3 p-5 text-lg text-muted"><li className="flex gap-3"><LockKeyhole aria-hidden="true" className="size-5 shrink-0 text-red" /> {copy.settingsCookieRule}</li><li className="flex gap-3"><Clock3 aria-hidden="true" className="size-5 shrink-0 text-yellow" /> {copy.settingsExpiryRule}</li><li className="flex gap-3"><ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-primary" /> {copy.settingsRoleRule}</li></ul></PixelPanel>
          </div>
        </div>
      </div>
    </main>
  );
}
