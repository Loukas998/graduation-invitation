import { motion } from "framer-motion";
import { useI18n, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "ar", label: "عربي" },
  { value: "en", label: "EN" },
];

export function LanguageToggle({
  className,
  onDark = false,
}: {
  className?: string;
  /** Liquid-glass over dark footage vs. theme glass over page surfaces. */
  onDark?: boolean;
}) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("a11y.toggleLanguage")}
      className={cn(
        "relative inline-flex h-11 items-center gap-1 rounded-full border p-1",
        "transition-[background-color,border-color,box-shadow] duration-500",
        onDark ? "glass-dark" : "glass-light",
        className,
      )}
    >
      {OPTIONS.map((option) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            aria-pressed={active}
            className={cn(
              "relative inline-flex h-9 min-w-11 items-center justify-center rounded-full px-3.5",
              "text-sm font-semibold whitespace-nowrap transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active
                ? "text-primary-foreground"
                : onDark
                  ? "text-white/75 hover:text-white"
                  : "text-foreground/70 hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span
              className="relative z-10 leading-normal"
              // Always shape عربي with the Arabic font, even while the page is LTR.
              lang={option.value === "ar" ? "ar" : undefined}
              dir={option.value === "ar" ? "rtl" : undefined}
              style={
                option.value === "ar"
                  ? { fontFamily: "var(--font-arabic)" }
                  : undefined
              }
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
