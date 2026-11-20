import { ServerCog } from "lucide-react";
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
          <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-8">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 border-2 border-primary bg-[#062116] px-3 py-2 font-pixel text-[8px] leading-relaxed text-primary">
                  <ServerCog aria-hidden="true" className="size-4" />{" "}
                  {copy.receiveNodeReady}
                </div>
                <h1 className="max-w-3xl font-pixel text-[clamp(1.4rem,3vw,2.75rem)] leading-[1.35] tracking-[-0.04em] text-foreground">
                  {copy.receiveTitleLine1}
                  <br />
                  <span className="text-primary neon-green">
                    {copy.receiveTitleLine2}
                  </span>
                </h1>
                <p className="mt-4 max-w-2xl text-xl leading-snug text-[#b2c3df] sm:text-2xl">
                  {copy.receiveIntro}
                </p>
              </div>
              <GuestStatusStrip />
            </div>
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
