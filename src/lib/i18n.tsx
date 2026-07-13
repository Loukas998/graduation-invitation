import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

export type Locale = "ar" | "en";
export type Direction = "rtl" | "ltr";

const MESSAGES: Record<Locale, Record<string, unknown>> = { en, ar };
const STORAGE_KEY = "intellipharma.locale";
const DEFAULT_LOCALE: Locale = "ar";

function resolveInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  // Optional ?lang= override lets you share a link that opens in a set language.
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param === "ar" || param === "en") return param;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "ar" || stored === "en") return stored;
  return DEFAULT_LOCALE;
}

function lookup(messages: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((node, key) =>
      node && typeof node === "object"
        ? (node as Record<string, unknown>)[key]
        : undefined,
    messages);
}

interface I18nContextValue {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (path: string, vars?: Record<string, string>) => string;
  tList: (path: string) => string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(resolveInitialLocale);
  const dir: Direction = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, dir]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggleLocale = useCallback(
    () => setLocaleState((prev) => (prev === "ar" ? "en" : "ar")),
    [],
  );

  const t = useCallback(
    (path: string, vars?: Record<string, string>) => {
      const value = lookup(MESSAGES[locale], path);
      if (typeof value !== "string") return path;
      if (!vars) return value;
      return value.replace(/\{(\w+)\}/g, (match, key) =>
        key in vars ? vars[key] : match,
      );
    },
    [locale],
  );

  const tList = useCallback(
    (path: string) => {
      const value = lookup(MESSAGES[locale], path);
      return Array.isArray(value) ? (value as string[]) : [];
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, dir, setLocale, toggleLocale, t, tList }),
    [locale, dir, setLocale, toggleLocale, t, tList],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
