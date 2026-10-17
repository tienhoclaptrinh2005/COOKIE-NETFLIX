import { Gamepad2, InfinityIcon } from "lucide-react";
import { GuestWorkbench } from "@/components/guest-workbench";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerDictionary } from "@/lib/i18n-server";

export default async function HomePage() {
  const copy = await getServerDictionary();
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="border-b-[3px] border-border bg-[#050b19]/80">
          <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
            <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 border-2 border-primary bg-[#062116] px-3 py-2 font-pixel text-[8px] leading-relaxed text-primary">
                  <span className="size-2 bg-primary status-pulse" aria-hidden="true" /> {copy.homeNodeReady}
                </div>
                <h1 className="max-w-5xl font-pixel text-[clamp(1.45rem,4vw,3.35rem)] leading-[1.35] tracking-[-0.04em] text-foreground">
                  {copy.homeTitleLine1}<br /><span className="text-primary neon-green">{copy.homeTitleLine2}</span>
                </h1>
                <p className="mt-5 max-w-3xl text-2xl leading-snug text-[#b2c3df] sm:text-3xl">
                  {copy.homeIntro}
                </p>
                <p className="mt-5 flex max-w-4xl items-start gap-3 border-2 border-primary bg-[#062116] p-4 text-lg leading-snug text-[#c5f7d7]">
                  <InfinityIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" /> {copy.manualUnlimitedNotice}
                </p>
              </div>
              <div className="hidden border-[3px] border-yellow bg-[#211b04] p-5 text-yellow shadow-[6px_6px_0_#000510] lg:block">
                <Gamepad2 aria-hidden="true" className="size-14" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <GuestWorkbench />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
