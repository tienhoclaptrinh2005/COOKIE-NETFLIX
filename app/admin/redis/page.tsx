import { Database, HardDrive, KeyRound, ShieldCheck } from "lucide-react";
import { AdminHeader } from "@/components/admin-header";
import { RedisControls } from "@/components/redis-controls";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getRedisOverview } from "@/lib/system";
import { getServerDictionary } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý Redis" };

export default async function RedisPage() {
  const copy = await getServerDictionary();
  const overview = await getRedisOverview();
  return (
    <main id="main-content" tabIndex={-1}>
      <AdminHeader title={copy.redisTitle} description={copy.redisDescription} />
      <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="pixel-shadow-sm border-[3px] border-blue bg-surface p-5"><Database aria-hidden="true" className="size-6 text-blue" /><p className="mt-4 font-pixel text-[8px] text-muted">{copy.redisConnection}</p><div className="mt-3"><StatusBadge tone={overview.online ? "live" : "warning"}>{overview.online ? "ONLINE" : overview.mode}</StatusBadge></div></div>
          <div className="pixel-shadow-sm border-[3px] border-primary bg-surface p-5"><KeyRound aria-hidden="true" className="size-6 text-primary" /><p className="mt-4 font-pixel text-[8px] text-muted">{copy.redisGroups}</p><p className="mt-3 font-pixel text-3xl">{overview.entries.length}</p></div>
          <div className="pixel-shadow-sm border-[3px] border-yellow bg-surface p-5"><ShieldCheck aria-hidden="true" className="size-6 text-yellow" /><p className="mt-4 font-pixel text-[8px] text-muted">{copy.redisValues}</p><p className="mt-3 font-pixel text-sm text-yellow">{copy.redisMasked}</p></div>
        </div>

        <PixelPanel title={copy.redisInventory} eyebrow={copy.redisInventoryEyebrow} accent="blue">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead><tr className="border-b-2 border-border bg-[#071126] font-pixel text-[8px] text-muted"><th scope="col" className="p-4">{copy.redisField}</th><th scope="col" className="p-4">{copy.redisCount}</th><th scope="col" className="p-4">{copy.redisClass}</th></tr></thead>
              <tbody>{overview.entries.map((entry) => { const protectedKey = entry.pattern === "NetflixId" || entry.pattern === "VN"; return <tr key={entry.pattern} className="border-b-2 border-border last:border-0"><td className="p-4 font-pixel text-[9px] text-foreground">{entry.pattern}</td><td className="p-4 text-2xl tabular-nums text-blue">{entry.count}</td><td className="p-4"><StatusBadge tone={protectedKey ? "warning" : "info"}>{protectedKey ? copy.redisProtected : copy.redisManaged}</StatusBadge></td></tr>; })}</tbody>
            </table>
          </div>
        </PixelPanel>

        <PixelPanel title={copy.redisMaintenance} eyebrow={copy.redisDestructive} accent="red">
          <div className="p-5 sm:p-6"><RedisControls /></div>
        </PixelPanel>

        <PixelPanel title={copy.redisDefinitions} eyebrow={copy.redisOneHash} accent="green">
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {[{ key: "NetflixId / VN", detail: copy.redisProtectedDetail }, { key: "pixel_press", detail: copy.redisRootDetail }, { key: "cau_hinh:gioi_han_ngay", detail: copy.redisConfigDetail }, { key: "cau_hinh:thong_bao_popup", detail: copy.redisAnnouncementDetail }, { key: "thong_ke:{trang_thai}", detail: copy.redisStatsDetail }, { key: "nhan:{thong_ke}", detail: copy.redisReceiveStatsDetail }, { key: "han_muc_nhan:{ngay}:{ma_ip}", detail: copy.redisQuotaDetail }, { key: "dang_nhap:that_bai:{ma_ip}", detail: copy.redisLoginDetail }].map((item) => <div key={item.key} className="border-2 border-border bg-[#071126] p-4"><HardDrive aria-hidden="true" className="mb-3 size-5 text-primary" /><code className="text-lg text-foreground">{item.key}</code><p className="mt-2 text-lg text-muted">{item.detail}</p></div>)}
          </div>
        </PixelPanel>
      </div>
    </main>
  );
}
