import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { authConfigured, getAdminSession } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n-server";

export const metadata = { title: "Admin Login" };

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");
  const copy = await getServerDictionary();
  return (
    <main id="main-content" className="grid min-h-dvh place-items-center px-4 py-10" tabIndex={-1}>
      <div className="w-full max-w-lg">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><Brand /><div className="flex items-center gap-2"><LanguageSwitcher compact /><Link href="/" className="inline-flex min-h-11 items-center gap-2 text-lg text-muted hover:text-primary"><ArrowLeft aria-hidden="true" className="size-4" /> {copy.loginGuestDeck}</Link></div></div>
        <PixelPanel title={copy.loginPanelTitle} eyebrow={copy.loginPanelEyebrow} accent="yellow">
          <div className="border-b-2 border-border bg-[#071126] p-6 text-center">
            <div className="mx-auto grid size-16 place-items-center border-[3px] border-yellow bg-[#261f06] text-yellow shadow-[4px_4px_0_#000510]"><ShieldCheck aria-hidden="true" className="size-9" /></div>
            <h1 className="mt-5 font-pixel text-sm leading-relaxed text-yellow">{copy.loginIdentity}</h1>
            <p className="mt-2 text-xl text-muted">{copy.loginDescription}</p>
          </div>
          <div className="p-5 sm:p-7"><LoginForm configured={authConfigured()} /></div>
        </PixelPanel>
      </div>
    </main>
  );
}
