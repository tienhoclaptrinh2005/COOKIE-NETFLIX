import { GuestWorkbench } from "@/components/guest-workbench";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <GuestWorkbench />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
