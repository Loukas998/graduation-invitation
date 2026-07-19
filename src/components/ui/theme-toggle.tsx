import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  onDark = false,
}: {
  className?: string;
  /** Liquid-glass over dark footage vs. theme glass over page surfaces. */
  onDark?: boolean;
}) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t("a11y.toggleTheme")}
      className={cn(
        "relative inline-flex size-11 items-center justify-center rounded-full border",
        "transition-[background-color,border-color,box-shadow,color] duration-500",
        onDark ? "glass-dark" : "glass-light",
        onDark
          ? "text-white/85 hover:text-white"
          : "text-foreground/80 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inline-flex"
        >
          {isDark ? (
            <Moon className="size-5" strokeWidth={1.75} />
          ) : (
            <Sun className="size-5" strokeWidth={1.75} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
