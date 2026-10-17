import { Gift, ServerCog } from "lucide-react";
import { GuestStatusStrip } from "@/components/guest-status-strip";
import { ReceiveWorkbench } from "@/components/receive-workbench";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerDictionary } from "@/lib/i18n-server";

export const metadata = { title: "COOKIE NETFLIX" };

export default async function ReceivePage() {
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
                  <ServerCog aria-hidden="true" className="size-4" />{" "}
                  {copy.receiveNodeReady}
                </div>
                <h1 className="max-w-5xl font-pixel text-[clamp(1.45rem,4vw,3.35rem)] leading-[1.35] tracking-[-0.04em] text-foreground">
                  {copy.receiveTitleLine1}
                  <br />
                  <span className="text-primary neon-green">
                    {copy.receiveTitleLine2}
                  </span>
                </h1>
                <p className="mt-5 max-w-4xl text-2xl leading-snug text-[#b2c3df] sm:text-3xl">
                  {copy.receiveIntro}
                </p>
              </div>
              <div className="hidden border-[3px] border-yellow bg-[#211b04] p-5 text-yellow shadow-[6px_6px_0_#000510] lg:block">
                <Gift
                  aria-hidden="true"
                  className="size-14"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <GuestStatusStrip />
          </div>
        </section>
        <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <ReceiveWorkbench />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
