import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Team } from "@/components/team/Team";
import { Footer } from "@/components/footer/Footer";

function App() {
  const { locale } = useI18n();

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 px-5 py-4 sm:px-6 lg:px-8">
          <LanguageToggle />
          <ThemeToggle />
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
          <Team />
          <Footer />
        </motion.main>
      </AnimatePresence>
    </MotionConfig>
  );
}

export default App;
