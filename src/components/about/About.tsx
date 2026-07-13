import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { fadeUp, inViewport, staggerContainer } from "@/lib/motion";

export function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative border-t border-border/60 py-24 sm:py-32">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8"
      >
        <motion.span
          variants={fadeUp}
          className="text-sm font-semibold uppercase tracking-widest text-teal-ink"
        >
          {t("about.kicker")}
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          {t("about.title")}
        </motion.h2>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
          <motion.p
            variants={fadeUp}
            className="text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("about.p1")}
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("about.p2")}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
