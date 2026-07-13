import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fadeUp, inViewport, staggerContainer } from "@/lib/motion";

/** Placeholder slot for a university / faculty seal to be supplied later. */
function SealSlot({ label }: { label: string }) {
  return (
    <div
      className="flex size-16 items-center justify-center rounded-full border border-dashed border-border text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70"
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative border-t border-border/60 bg-card/30 py-16">
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 text-center sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <SealSlot label="Seal" />
          <span
            className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <GraduationCap className="size-5.5" strokeWidth={1.75} />
          </span>
          <SealSlot label="Seal" />
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-1">
          <p className="text-lg font-semibold text-foreground">
            {t("footer.university")}
          </p>
          <p className="text-sm text-muted-foreground">{t("footer.faculty")}</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 text-sm text-muted-foreground"
        >
          <span className="font-medium text-teal-ink">{t("footer.note")}</span>
          <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
          <span dir="ltr">{t("footer.date")}</span>
        </motion.div>
      </motion.div>
    </footer>
  );
}
