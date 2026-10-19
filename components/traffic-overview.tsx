import {
  BarChart3,
  Eye,
  RadioTower,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { AdminStatCard } from "@/components/admin-stat-card";
import { PixelPanel } from "@/components/ui/pixel-panel";
import type { Dictionary } from "@/lib/i18n";
import type { TrafficStats, TrackedPublicPath } from "@/lib/traffic";

function dayLabel(date: string) {
  const [, month, day] = date.split("-");
  return `${day}/${month}`;
}

function pageLabel(path: TrackedPublicPath, copy: Dictionary) {
  if (path === "/receive") return copy.overviewTrafficReceivePage;
  if (path === "/login") return copy.overviewTrafficLoginPage;
  return copy.overviewTrafficHomePage;
}

export function TrafficOverview({
  stats,
  copy,
}: {
  stats: TrafficStats;
  copy: Dictionary;
}) {
  const maxDailyViews = Math.max(1, ...stats.days.map((day) => day.pageViews));
  const maxPageViews = Math.max(1, ...stats.topPages.map((page) => page.pageViews));

  return (
    <section aria-labelledby="traffic-overview-title" className="space-y-4">
      <div className="border-l-4 border-blue pl-4">
        <p className="font-pixel text-[8px] uppercase tracking-[0.16em] text-blue">
          {copy.overviewTrafficEyebrow}
        </p>
        <h2 id="traffic-overview-title" className="mt-2 font-pixel text-sm uppercase leading-relaxed sm:text-base">
          {copy.overviewTrafficTitle}
        </h2>
        <p className="mt-1 text-lg text-muted">{copy.overviewTrafficDescription}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label={copy.overviewTrafficTodayViews}
          value={stats.todayPageViews}
          detail={copy.overviewTrafficTodayViewsDetail}
          icon={Eye}
          tone="blue"
        />
        <AdminStatCard
          label={copy.overviewTrafficTodayVisitors}
          value={stats.todayEstimatedVisitors}
          detail={copy.overviewTrafficTodayVisitorsDetail}
          icon={UsersRound}
          tone="violet"
        />
        <AdminStatCard
          label={copy.overviewTrafficActive}
          value={stats.activeVisitors}
          detail={copy.overviewTrafficActiveDetail}
          icon={RadioTower}
          tone="green"
        />
        <AdminStatCard
          label={copy.overviewTrafficTotal}
          value={stats.totalPageViews}
          detail={copy.overviewTrafficTotalDetail}
          icon={BarChart3}
          tone="yellow"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <PixelPanel
          title={copy.overviewTrafficTrend}
          eyebrow={copy.overviewTrafficTrendDetail}
          accent="blue"
        >
          <div className="space-y-3 p-5 sm:p-6">
            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_3rem_4.5rem] gap-3 border-b-2 border-border pb-3 font-pixel text-[7px] uppercase leading-relaxed text-muted sm:grid-cols-[4rem_minmax(0,1fr)_4rem_6rem]">
              <span>{copy.overviewTrafficDay}</span>
              <span>{copy.overviewTrafficPageViews}</span>
              <span className="text-right">{copy.overviewTrafficCount}</span>
              <span className="text-right">{copy.overviewTrafficVisitorsShort}</span>
            </div>
            {stats.days.map((day) => (
              <div
                key={day.date}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)_3rem_4.5rem] items-center gap-3 sm:grid-cols-[4rem_minmax(0,1fr)_4rem_6rem]"
              >
                <time dateTime={day.date} className="font-pixel text-[8px] text-foreground">
                  {dayLabel(day.date)}
                </time>
                <div className="h-5 border-2 border-border bg-[#030815] p-[2px]">
                  <div
                    className="h-full origin-left bg-blue"
                    style={{ transform: `scaleX(${day.pageViews / maxDailyViews})` }}
                  />
                </div>
                <span className="text-right text-xl tabular-nums text-blue">{day.pageViews}</span>
                <span className="text-right text-xl tabular-nums text-violet">
                  ~{day.estimatedVisitors}
                </span>
              </div>
            ))}
          </div>
        </PixelPanel>

        <PixelPanel
          title={copy.overviewTrafficTopPages}
          eyebrow={copy.overviewTrafficTopPagesDetail}
          accent="violet"
        >
          <div className="space-y-5 p-5 sm:p-6">
            {stats.topPages.map((page) => (
              <div key={page.path}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-pixel text-[8px] uppercase leading-relaxed text-foreground">
                      {pageLabel(page.path, copy)}
                    </p>
                    <code className="mt-1 block text-base text-muted">{page.path}</code>
                  </div>
                  <span className="font-pixel text-[10px] text-violet">{page.pageViews}</span>
                </div>
                <div className="h-4 border-2 border-border bg-[#030815] p-[2px]">
                  <div
                    className="h-full origin-left bg-violet"
                    style={{ transform: `scaleX(${page.pageViews / maxPageViews})` }}
                  />
                </div>
              </div>
            ))}
            <p className="flex gap-3 border-t-2 border-border pt-4 text-lg leading-relaxed text-muted">
              <ShieldCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
              {copy.overviewTrafficPrivacy}
            </p>
          </div>
        </PixelPanel>
      </div>
    </section>
  );
}
