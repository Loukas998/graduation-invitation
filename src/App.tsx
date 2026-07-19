import { useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { GlassScrollbar } from "@/components/ui/glass-scrollbar";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Journey } from "@/components/journey/Journey";
import { Team } from "@/components/team/Team";
import { SaveTheDate } from "@/components/event/SaveTheDate";
import { Footer } from "@/components/footer/Footer";

function App() {
  const { locale, dir, t } = useI18n();

  const { scrollY, scrollYProgress } = useScroll();
  const readProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    restDelta: 0.001,
  });

  // The hero video is dark in both themes; past it, the page follows the theme.
  // Header chips swap between white liquid glass and theme glass accordingly.
  const [overHero, setOverHero] = useState(true);
  useMotionValueEvent(scrollY, "change", (y) => {
    setOverHero(y < window.innerHeight * 0.75);
  });

  return (
    <MotionConfig reducedMotion="user">
      {/* Reading-progress thread — quietly invites guests to keep scrolling */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-teal via-brand to-warm"
        style={{
          scaleX: readProgress,
          transformOrigin: dir === "rtl" ? "100% 50%" : "0% 50%",
        }}
      />

      <GlassScrollbar />

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-5 py-4 sm:px-6 lg:px-8">
          <a
            href="#"
            aria-label={t("a11y.logo")}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-semibold tracking-tight",
              "transition-[background-color,border-color,box-shadow] duration-500",
              overHero ? "glass-dark" : "glass-light",
            )}
          >
            <span
              className={
                overHero ? "text-gradient-brand-vivid" : "text-gradient-brand"
              }
            >
              IntelliPharma
            </span>
          </a>
          <div className="flex items-center gap-2">
            <LanguageToggle onDark={overHero} />
            <ThemeToggle onDark={overHero} />
          </div>
        </div>
      </header>

      {/* Whole-page crossfade on language change — no jarring swap. */}
      <AnimatePresence mode="wait">
        <motion.main
          key={locale}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Hero />
          <About />
          <Journey />
          <Team />
          <SaveTheDate />
          <Footer />
        </motion.main>
      </AnimatePresence>
    </MotionConfig>
  );
}

export default App;
