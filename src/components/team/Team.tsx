import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { fadeUp, inViewport, staggerContainer } from "@/lib/motion";

export function Team() {
  const { t, tList } = useI18n();
  const members = tList("team.members");

  return (
    <section id="team" className="relative border-t border-border/60 py-24 sm:py-32">
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8"
      >
        <motion.h2
          variants={fadeUp}
          className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          {t("team.title")}
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((name, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card/50 px-5 py-4 backdrop-blur-sm transition-colors hover:border-teal/50 hover:bg-card"
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
                aria-hidden="true"
              >
                {String(i + 1)}
              </span>
              <span className="text-base font-medium text-foreground">
                {name}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          className="mx-auto mt-12 max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("team.supervisionLabel")}
          </p>
          <p className="mt-2 text-base font-medium text-foreground sm:text-lg">
            {t("team.supervision")}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
