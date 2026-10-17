import { cookies } from "next/headers";
import { getDictionary, LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n";

export async function getLocale() {
  const store = await cookies();
  return normalizeLocale(store.get(LOCALE_COOKIE)?.value);
}

export async function getServerDictionary() {
  return getDictionary(await getLocale());
}
