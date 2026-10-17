import { getServerDictionary } from "@/lib/i18n-server";

export async function SiteFooter() {
  const copy = await getServerDictionary();
  return (
    <footer className="border-t-[3px] border-border bg-[#030815]">
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 px-4 py-6 text-center text-lg text-muted sm:flex-row sm:px-6 sm:text-left lg:px-10">
        <p>{copy.footerPrivacy}</p>
        <p className="font-pixel text-[8px] leading-relaxed text-[#6e83a8]">{copy.footerSecrets}</p>
      </div>
    </footer>
  );
}
