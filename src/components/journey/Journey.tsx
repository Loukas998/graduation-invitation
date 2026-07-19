import { useRef, type ComponentType } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  BrainCircuit,
  PackageCheck,
  Server,
  Smartphone,
  Store,
  type LucideProps,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fadeUp, inViewport, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StepId = "order" | "brain" | "backend" | "field" | "delivered";

const STEPS: {
  id: StepId;
  Icon: ComponentType<LucideProps>;
  /** warm = human-world stops, teal = system stops. */
  tone: "teal" | "warm";
}[] = [
  { id: "order", Icon: Store, tone: "warm" },
  { id: "brain", Icon: BrainCircuit, tone: "teal" },
  { id: "backend", Icon: Server, tone: "teal" },
  { id: "field", Icon: Smartphone, tone: "teal" },
  { id: "delivered", Icon: PackageCheck, tone: "warm" },
];

export function Journey() {
  const { t, dir } = useI18n();
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLOListElement>(null);

  // Route line fills as the reader travels the story.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.72", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const dotTop = useTransform(progress, (v) => `${Math.min(v, 1) * 100}%`);

  const scrollToDetails = () => {
    document
      .getElementById("details")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      id="journey"
      className="relative overflow-hidden border-t border-border/60 bg-card/45 py-24 dark:bg-transparent sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute -top-24 start-0 h-96 w-96 -translate-x-1/3 rounded-full opacity-35 blur-3xl dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--warm) 30%, transparent), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-10 end-0 h-96 w-96 translate-x-1/3 rounded-full opacity-40 blur-3xl dark:opacity-25"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--teal) 32%, transparent), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8"
      >
        <motion.span
          variants={fadeUp}
          className="text-sm font-semibold uppercase tracking-widest text-teal-ink"
        >
          {t("journey.kicker")}
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          {t("journey.title")}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          {t("journey.lead")}
        </motion.p>
      </motion.div>

      <div className="mx-auto mt-16 max-w-6xl px-5 sm:mt-20 sm:px-6 lg:px-8">
        <ol ref={trackRef} className="relative">
          {/* Route spine — dashed base + scroll-filled gradient + traveling dot */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute top-2 bottom-2 w-px",
              // left-1/2 (physical) — start-1/2 + physical translate mis-centers in RTL.
              "start-[1.375rem] md:start-auto md:left-1/2 md:-translate-x-1/2",
            )}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, var(--border) 55%, transparent 55%)",
                backgroundSize: "1px 10px",
              }}
            />
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              style={{
                height: "100%",
                scaleY: reduce ? 1 : progress,
                background:
                  "linear-gradient(to bottom, var(--warm), var(--teal) 45%, var(--teal) 75%, var(--warm))",
              }}
            />
            {!reduce && (
              <motion.span
                className="absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warm shadow-[0_0_12px_4px_color-mix(in_oklab,var(--warm)_55%,transparent)]"
                style={{ top: dotTop }}
              />
            )}
          </div>

          {STEPS.map((step, index) => (
            <JourneyStep
              key={step.id}
              step={step}
              index={index}
              flip={index % 2 === 1}
              dir={dir}
              reduce={!!reduce}
              t={t}
            />
          ))}
        </ol>

        {/* Closing callout — turns the story into the invitation */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewport}
          className="relative mx-auto mt-16 max-w-2xl sm:mt-20"
        >
          <motion.div
            variants={fadeUp}
            className={cn(
              "relative overflow-hidden rounded-3xl border border-teal/30 bg-card p-8 text-center backdrop-blur-sm dark:bg-card/70 sm:p-10",
              "shadow-[0_20px_60px_-30px_color-mix(in_oklab,var(--teal)_55%,transparent)]",
            )}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% -20%, color-mix(in oklab, var(--teal) 14%, transparent), transparent 60%)",
              }}
            />
            <p className="relative text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {t("journey.closing")}
            </p>
            <p className="relative mt-2 text-base text-muted-foreground sm:text-lg">
              {t("journey.closingSub")}
            </p>
            <motion.button
              type="button"
              onClick={scrollToDetails}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className={cn(
                "relative mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold",
                "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                "outline-none transition-colors hover:bg-primary/90",
                "focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              {t("journey.cta")}
              <ArrowDown className="size-4" strokeWidth={2} aria-hidden="true" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function JourneyStep({
  step,
  index,
  flip,
  dir,
  reduce,
  t,
}: {
  step: (typeof STEPS)[number];
  index: number;
  flip: boolean;
  dir: "rtl" | "ltr";
  reduce: boolean;
  t: (path: string) => string;
}) {
  const teal = step.tone === "teal";
  const sideX = flip ? 40 : -40;
  const rtlSideX = dir === "rtl" ? -sideX : sideX;

  return (
    <motion.li
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some", margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative flex gap-5 pb-12 last:pb-0 sm:gap-6 sm:pb-16",
        "md:grid md:grid-cols-[1fr_5rem_1fr] md:gap-0",
      )}
    >
      {/* Node — sits on the spine */}
      <div
        className={cn(
          "relative z-10 shrink-0 self-start md:col-start-2 md:row-start-1 md:justify-self-center",
        )}
      >
        <motion.span
          initial={reduce ? undefined : { scale: 0.6, opacity: 0 }}
          whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -60px 0px" }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl border-2 bg-card shadow-md sm:size-12",
            teal
              ? "border-teal/60 text-teal-ink shadow-teal/10"
              : "border-warm/60 text-warm shadow-warm/10",
          )}
        >
          <step.Icon className="size-5 sm:size-5.5" strokeWidth={1.75} aria-hidden="true" />
        </motion.span>
      </div>

      {/* Card */}
      <motion.article
        initial={reduce ? undefined : { opacity: 0, x: rtlSideX }}
        whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, amount: "some", margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        whileHover={reduce ? undefined : { y: -4 }}
        className={cn(
          "group min-w-0 flex-1 rounded-3xl border border-border/70 p-5 backdrop-blur-sm sm:p-6",
          // Solid card + lift in light — translucent glass in dark.
          "bg-card shadow-[0_14px_40px_-26px_color-mix(in_oklab,var(--brand)_60%,transparent)] dark:bg-card/60 dark:shadow-none",
          "transition-[border-color,box-shadow] duration-300",
          "md:row-start-1",
          teal
            ? "hover:border-teal/45 hover:shadow-[0_16px_44px_-24px_color-mix(in_oklab,var(--teal)_60%,transparent)]"
            : "hover:border-warm/45 hover:shadow-[0_16px_44px_-24px_color-mix(in_oklab,var(--warm)_60%,transparent)]",
          flip
            ? "md:col-start-3 md:justify-self-start md:max-w-md"
            : "md:col-start-1 md:justify-self-end md:max-w-md",
        )}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span
            className={cn(
              "font-mono text-xs font-semibold tracking-widest",
              teal ? "text-teal-ink" : "text-warm",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
              teal
                ? "bg-accent text-accent-foreground"
                : "bg-warm/10 text-warm",
            )}
          >
            {t(`journey.steps.${step.id}.label`)}
          </span>
          <span className="ms-auto font-mono text-[11px] font-medium tracking-wide text-muted-foreground/80">
            {t(`journey.steps.${step.id}.time`)}
          </span>
        </div>

        <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {t(`journey.steps.${step.id}.title`)}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t(`journey.steps.${step.id}.body`)}
        </p>
      </motion.article>

      {/* Desktop spacer keeps the empty half of the grid */}
      <div
        aria-hidden="true"
        className={cn(
          "hidden md:block md:row-start-1",
          flip ? "md:col-start-1" : "md:col-start-3",
        )}
      />
    </motion.li>
  );
}
