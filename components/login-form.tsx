"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertOctagon, Eye, EyeOff, KeyRound, LogIn, UserRound } from "lucide-react";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelInput } from "@/components/ui/pixel-input";
import { useI18n } from "@/components/i18n-provider";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const { copy } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || copy.loginFailed);
      router.push("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.loginRetry);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {!configured && (
        <div role="alert" className="flex gap-3 border-2 border-yellow bg-[#2a2105] p-3 text-yellow">
          <AlertOctagon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p className="leading-snug">{copy.loginConfigMissing}</p>
        </div>
      )}
      <div>
        <label htmlFor="username" className="mb-2 flex items-center gap-2 font-pixel text-[8px] uppercase leading-relaxed text-foreground"><UserRound aria-hidden="true" className="size-4 text-blue" /> {copy.loginUsername}</label>
        <PixelInput id="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required maxLength={80} disabled={loading || !configured} />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 flex items-center gap-2 font-pixel text-[8px] uppercase leading-relaxed text-foreground"><KeyRound aria-hidden="true" className="size-4 text-yellow" /> {copy.loginPassword}</label>
        <div className="relative">
          <PixelInput id="password" type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required minLength={12} maxLength={200} disabled={loading || !configured} aria-describedby="login-error" className="pr-14" />
          <button type="button" onClick={() => setShow((value) => !value)} className="absolute right-0 top-0 grid size-12 cursor-pointer place-items-center text-muted hover:text-foreground" aria-label={show ? copy.loginHidePassword : copy.loginShowPassword} aria-pressed={show}>
            {show ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>
      {error && <div id="login-error" role="alert" className="flex gap-3 border-2 border-red bg-[#2b0810] p-3 text-[#ff9ca5]"><AlertOctagon aria-hidden="true" className="mt-0.5 size-5 shrink-0" /><p>{error}</p></div>}
      <PixelButton type="submit" size="lg" className="w-full" disabled={!configured || loading || !username || password.length < 12}>
        {loading ? <><span className="pixel-loader mr-7" aria-hidden="true" /> {copy.loginLoading}</> : <><LogIn aria-hidden="true" className="size-4" /> {copy.loginSubmit}</>}
      </PixelButton>
      <p className="text-center text-lg text-muted">{copy.loginHelp}</p>
    </form>
  );
}
