import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, GraduationCap, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fadeUp, inViewport, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span
        className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground"
        aria-hidden="true"
      >
        <Icon className="size-4.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground sm:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}

/** Decorative ticket "barcode" — pure CSS stripes, no data. */
function Barcode({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex h-10 items-stretch gap-[3px] opacity-50", className)}
    >
      {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2].map((w, i) => (
        <span
          key={i}
          className="rounded-[1px] bg-foreground/70"
          style={{ width: `${w}px` }}
        />
      ))}
    </div>
  );
}

export function SaveTheDate() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section
      id="details"
      className="relative overflow-hidden border-t border-border/60 bg-card/45 py-24 dark:bg-transparent sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute top-1/2 left-1/2 h-[30rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-3xl dark:opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, color-mix(in oklab, var(--teal) 26%, transparent), transparent 70%)",
          }}
        />
      </div>

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="mx-auto max-w-6xl px-5 text-center sm:px-6 lg:px-8"
      >
        <motion.span
          variants={fadeUp}
          className="text-sm font-semibold uppercase tracking-widest text-teal-ink"
        >
          {t("saveTheDate.kicker")}
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          {t("saveTheDate.title")}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          {t("saveTheDate.lead")}
        </motion.p>

        {/* The ticket */}
        <motion.div
          variants={fadeUp}
          whileHover={reduce ? undefined : { y: -6, rotate: -0.4 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={cn(
            "relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-3xl border border-border/70 text-start",
            "bg-card shadow-[0_28px_80px_-36px_color-mix(in_oklab,var(--brand)_55%,transparent)]",
            "dark:bg-card/70 dark:backdrop-blur-xl",
          )}
        >
          {/* Gradient top edge */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-brand to-warm"
          />

          <div className="grid sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
            {/* Stub — date block */}
            <div className="relative flex flex-col items-center justify-center gap-2 px-6 py-8 text-center sm:py-10">
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-foreground"
              >
                <GraduationCap className="size-3.5" strokeWidth={2} aria-hidden="true" />
                {t("saveTheDate.admitLabel")}
              </span>
              <p className="mt-2 font-mono text-6xl font-bold leading-none tracking-tighter text-foreground sm:text-7xl">
                {t("saveTheDate.day")}
              </p>
              <p className="text-lg font-semibold text-teal-ink">
                {t("saveTheDate.month")}
              </p>
              <p className="font-mono text-sm tracking-[0.3em] text-muted-foreground">
                {t("saveTheDate.year")}
              </p>

              {/* Perforation — horizontal on mobile, vertical from sm up */}
              <div
                aria-hidden="true"
                className="absolute inset-x-5 bottom-0 border-b-2 border-dashed border-border sm:inset-x-auto sm:inset-y-5 sm:end-0 sm:bottom-auto sm:border-b-0 sm:border-e-2"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-3 -start-3 size-6 rounded-full bg-background ring-1 ring-border/70 sm:-end-3 sm:-top-3 sm:bottom-auto sm:start-auto"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-3 -end-3 size-6 rounded-full bg-background ring-1 ring-border/70 sm:-bottom-3 sm:-end-3"
              />
            </div>

            {/* Body — details */}
            <div className="flex flex-col gap-5 px-6 py-8 sm:px-8 sm:py-10">
              <DetailRow
                icon={CalendarDays}
                label={t("event.dateLabel")}
                value={t("event.dateValue")}
              />
              <DetailRow
                icon={Clock}
                label={t("event.timeLabel")}
                value={t("event.timeValue")}
              />
              <DetailRow
                icon={MapPin}
                label={t("event.locationLabel")}
                value={t("event.locationValue")}
              />

              <div className="mt-auto flex items-end justify-between gap-4 border-t border-border/50 pt-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/80">
                  {t("saveTheDate.ticketNote")}
                </p>
                <Barcode className="shrink-0" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
