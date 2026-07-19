import { useRef, useState, type ComponentType } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useI18n } from "@/lib/i18n";
import {
  fadeUp,
  inViewport,
  illustrReveal,
  staggerContainer,
  storyReveal,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  AdaptiveRoutes,
  EverydayAI,
  GoodsFlow,
  LogisticsStakes,
} from "./AboutIllustrations";

type BeatId = "everyday" | "flow" | "stakes" | "engine";

const BEATS: {
  id: BeatId;
  step: string;
  Illustration: ComponentType<{ className?: string; active?: boolean }>;
}[] = [
  { id: "everyday", step: "01", Illustration: EverydayAI },
  { id: "flow", step: "02", Illustration: GoodsFlow },
  { id: "stakes", step: "03", Illustration: LogisticsStakes },
  { id: "engine", step: "04", Illustration: AdaptiveRoutes },
];

const timelineVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

export function About() {
  const { t, dir } = useI18n();
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<BeatId | null>(null);
  const [focused, setFocused] = useState<BeatId | null>(null);

  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-border/60 py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl dark:opacity-25"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--teal) 35%, transparent), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 end-0 h-72 w-72 translate-x-1/4 translate-y-1/4 rounded-full opacity-30 blur-3xl dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--warm) 30%, transparent), transparent 70%)",
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
          {t("about.kicker")}
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          {t("about.title")}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          {t("about.lead")}
        </motion.p>

        <div className="relative mt-16 sm:mt-20">
          <motion.div
            aria-hidden="true"
            variants={timelineVariants}
            className={cn(
              "absolute top-0 bottom-0 hidden w-px origin-top bg-gradient-to-b from-teal via-border to-warm md:block",
              dir === "rtl" ? "right-[1.65rem]" : "left-[1.65rem]",
            )}
          />

          <ol className="flex flex-col gap-10 sm:gap-14 md:gap-16">
            {BEATS.map((beat, index) => (
              <StoryBeat
                key={beat.id}
                beat={beat}
                index={index}
                flip={index % 2 === 1}
                dir={dir}
                reduce={!!reduce}
                interactive={hovered === beat.id || focused === beat.id}
                onHoverStart={() => setHovered(beat.id)}
                onHoverEnd={() => setHovered(null)}
                onFocus={() => setFocused(beat.id)}
                onBlur={() => setFocused(null)}
                t={t}
              />
            ))}
          </ol>
        </div>
      </motion.div>
    </section>
  );
}

function StoryBeat({
  beat,
  index,
  flip,
  dir,
  reduce,
  interactive,
  onHoverStart,
  onHoverEnd,
  onFocus,
  onBlur,
  t,
}: {
  beat: (typeof BEATS)[number];
  index: number;
  flip: boolean;
  dir: "rtl" | "ltr";
  reduce: boolean;
  interactive: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onFocus: () => void;
  onBlur: () => void;
  t: (path: string) => string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // "some" — beat cards are ~1 screen tall on mobile; a high amount never triggers.
  const inView = useInView(ref, { once: true, amount: "some", margin: "0px 0px -64px 0px" });
  const present = interactive || inView;
  const live = interactive;

  return (
    <motion.li
      ref={ref}
      variants={storyReveal}
      custom={index}
      className="relative"
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <motion.span
        aria-hidden="true"
        className={cn(
          "absolute top-8 z-10 hidden size-3.5 rounded-full border-2 border-teal bg-background md:block",
          dir === "rtl" ? "right-[1.25rem]" : "left-[1.25rem]",
        )}
        animate={
          interactive && !reduce
            ? {
                scale: [1, 1.35, 1],
                boxShadow: [
                  "0 0 0 0 color-mix(in oklab, var(--teal) 0%, transparent)",
                  "0 0 0 8px color-mix(in oklab, var(--teal) 25%, transparent)",
                  "0 0 0 0 color-mix(in oklab, var(--teal) 0%, transparent)",
                ],
              }
            : present
              ? { scale: 1.15, boxShadow: "0 0 0 4px color-mix(in oklab, var(--teal) 20%, transparent)" }
              : { scale: 1, boxShadow: "0 0 0 0 transparent" }
        }
        transition={
          interactive && !reduce
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : { type: "spring", stiffness: 260, damping: 22 }
        }
      />

      <motion.article
        tabIndex={0}
        whileHover={reduce ? undefined : { y: -4 }}
        whileTap={reduce ? undefined : { scale: 0.995 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className={cn(
          "group cursor-default outline-none md:ms-12",
          "rounded-3xl border border-transparent",
          "transition-[border-color,background-color] duration-300",
          "hover:border-border/80 hover:bg-card/40",
          "focus-visible:border-teal/50 focus-visible:bg-card/50 focus-visible:ring-2 focus-visible:ring-teal/30",
        )}
        aria-labelledby={`about-beat-${beat.id}`}
      >
        <div
          className={cn(
            "grid items-center gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-2 lg:gap-12",
            flip && "lg:[&>*:first-child]:order-2",
          )}
        >
          <motion.div
            variants={illustrReveal}
            className={cn(
              "relative aspect-[14/11] overflow-hidden rounded-2xl",
              "bg-gradient-to-br from-accent/60 via-card to-card dark:from-accent/40 dark:via-muted/30 dark:to-transparent",
              "ring-1 ring-border shadow-[0_12px_36px_-26px_color-mix(in_oklab,var(--brand)_55%,transparent)] dark:ring-border/60 dark:shadow-none",
            )}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, color-mix(in oklab, var(--teal) 12%, transparent), transparent 55%)",
              }}
            />
            <beat.Illustration
              className="relative p-4 sm:p-6"
              active={live}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute end-4 top-3 font-mono text-4xl font-bold tracking-tighter text-foreground/[0.06] sm:text-5xl"
            >
              {beat.step}
            </span>
          </motion.div>

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold tracking-widest text-teal-ink">
                {beat.step}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
                {t(`about.beats.${beat.id}.label`)}
              </span>
            </div>

            <h3
              id={`about-beat-${beat.id}`}
              className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {t(`about.beats.${beat.id}.title`)}
            </h3>

            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t(`about.beats.${beat.id}.body`)}
            </p>

            <motion.div
              aria-hidden="true"
              className="mt-6 h-0.5 rounded-full bg-gradient-to-r from-teal to-warm"
              initial={false}
              animate={{ scaleX: present ? 1 : 0.18 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformOrigin: dir === "rtl" ? "100% 50%" : "0% 50%",
              }}
            />
          </div>
        </div>
      </motion.article>
    </motion.li>
  );
}
