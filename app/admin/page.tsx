import { Activity, CircleHelp, Database, Gauge, HeartPulse, InfinityIcon, Radio, ShieldCheck, Skull, UsersRound, Zap } from "lucide-react";
import { AdminHeader } from "@/components/admin-header";
import { AdminStatCard } from "@/components/admin-stat-card";
import { TrafficOverview } from "@/components/traffic-overview";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getSystemStats } from "@/lib/system";
import { getTrafficStats } from "@/lib/traffic";
import { formatMessage } from "@/lib/i18n";
import { getServerDictionary } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Control Center" };

export default async function AdminPage() {
  const copy = await getServerDictionary();
  const [stats, traffic] = await Promise.all([getSystemStats(), getTrafficStats()]);
  const resultTotal = Math.max(1, stats.live + stats.die + stats.unknown);
  const resultRows = [
    { label: "LIVE", value: stats.live, color: "bg-primary", text: "text-primary", icon: ShieldCheck },
    { label: "DIE", value: stats.die, color: "bg-red", text: "text-red", icon: Skull },
    { label: "UNKNOWN", value: stats.unknown, color: "bg-yellow", text: "text-yellow", icon: CircleHelp },
  ];
  return (
    <main id="main-content" tabIndex={-1}>
      <AdminHeader title={copy.overviewTitle} description={copy.overviewDescription} />
      <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label={copy.overviewTotalRequests} value={stats.requests} detail={copy.overviewAllChecks} icon={Zap} tone="blue" />
          <AdminStatCard label={copy.overviewGuestQuota} value={stats.dailyLimit} detail={copy.overviewCreditsPerDay} icon={Gauge} tone="yellow" />
          <AdminStatCard label={copy.overviewActiveQuota} value={stats.activeQuotaKeys} detail={copy.overviewCurrentWindow} icon={UsersRound} tone="violet" />
          <AdminStatCard label={copy.overviewAdminQuota} value="∞" detail={copy.overviewExempt} icon={InfinityIcon} tone="green" />
        </div>

        <TrafficOverview stats={traffic} copy={copy} />

        <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
          <PixelPanel title={copy.overviewDistribution} eyebrow={copy.overviewOutcomes} accent="blue">
            <div className="space-y-5 p-5 sm:p-6">
              {resultRows.map(({ label, value, color, text, icon: Icon }) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between gap-3"><span className={`flex items-center gap-2 font-pixel text-[8px] ${text}`}><Icon aria-hidden="true" className="size-4" /> {label}</span><span className="font-pixel text-[9px]">{value}</span></div>
                  <div className="h-7 border-2 border-border bg-[#030815] p-[3px]"><div className={`h-full origin-left ${color}`} style={{ transform: `scaleX(${value / resultTotal})` }} /></div>
                </div>
              ))}
              <p className="border-t-2 border-border pt-4 text-lg text-muted">{copy.overviewAccessibleStatus}</p>
            </div>
          </PixelPanel>

          <PixelPanel title={copy.overviewHealth} eyebrow={copy.overviewConnections} accent="green">
            <div className="divide-y-2 divide-border">
              <div className="flex items-center justify-between gap-3 p-5"><span className="flex items-center gap-3 text-xl"><Database aria-hidden="true" className="size-5 text-blue" /> {copy.overviewRedisStore}</span><StatusBadge tone={stats.redisOnline ? "live" : "warning"}>{stats.redisOnline ? "ONLINE" : stats.redisMode}</StatusBadge></div>
              <div className="flex items-center justify-between gap-3 p-5"><span className="flex items-center gap-3 text-xl"><Activity aria-hidden="true" className="size-5 text-primary" /> {copy.overviewApiRuntime}</span><StatusBadge tone="live">{copy.overviewHealthy}</StatusBadge></div>
              <div className="flex items-center justify-between gap-3 p-5"><span className="flex items-center gap-3 text-xl"><HeartPulse aria-hidden="true" className="size-5 text-red" /> {copy.overviewAuthGuard}</span><StatusBadge tone="live">{copy.overviewActive}</StatusBadge></div>
            </div>
          </PixelPanel>
        </div>

        <PixelPanel title={copy.overviewFeed} eyebrow={copy.overviewNotices} accent="violet">
          <div className="grid gap-3 p-5 md:grid-cols-3">
            {[{ title: copy.overviewQuotaEngine, body: formatMessage(copy.overviewCreditsBody, { limit: stats.dailyLimit }), icon: Gauge }, { title: copy.overviewRedisMode, body: stats.redisMode, icon: Database }, { title: copy.overviewControlLink, body: copy.overviewSessionVerified, icon: Radio }].map(({ title, body, icon: Icon }) => <div key={title} className="border-2 border-border bg-[#071126] p-4"><Icon aria-hidden="true" className="mb-3 size-5 text-violet" /><p className="font-pixel text-[8px] leading-relaxed">{title}</p><p className="mt-2 text-xl text-muted">{body}</p></div>)}
          </div>
        </PixelPanel>
      </div>
    </main>
  );
}
