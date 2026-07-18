import { useId, useState, type ComponentType } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { fadeUp, inViewport, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  RoleAI,
  RoleBackend,
  RoleFlutter,
  RoleFrontend,
} from "./TeamIllustrations";

type RoleId = "ai" | "backend" | "frontend" | "flutter";

type MemberId =
  | "majdLouka"
  | "majdArous"
  | "mohammedOmar"
  | "mostafaSharaf"
  | "alaaKaissi";

/** Court hub — gray center circle and Backend jersey share this point. */
const COURT_HUB = { x: 50, y: 48 } as const;

/** Court positions — Backend is the hub (center); AI playmaker; clients on the wings. */
const ROLES: {
  id: RoleId;
  members: MemberId[];
  Illustration: ComponentType<{ className?: string; active?: boolean }>;
  x: number;
  y: number;
  jersey: string;
}[] = [
  {
    id: "ai",
    members: ["alaaKaissi"],
    Illustration: RoleAI,
    x: 50,
    y: 18,
    jersey: "01",
  },
  {
    id: "backend",
    members: ["majdLouka", "majdArous"],
    Illustration: RoleBackend,
    x: COURT_HUB.x,
    y: COURT_HUB.y,
    jersey: "05",
  },
  {
    id: "frontend",
    members: ["mohammedOmar"],
    Illustration: RoleFrontend,
    x: 20,
    y: 76,
    jersey: "07",
  },
  {
    id: "flutter",
    members: ["mostafaSharaf"],
    Illustration: RoleFlutter,
    x: 80,
    y: 76,
    jersey: "11",
  },
];

/** Pass edges — how the technical parts talk (Backend is the hub). */
const PASSES: { from: RoleId; to: RoleId; labelKey: string }[] = [
  { from: "ai", to: "backend", labelKey: "team.passes.aiBackend" },
  { from: "backend", to: "frontend", labelKey: "team.passes.backendFrontend" },
  { from: "backend", to: "flutter", labelKey: "team.passes.backendFlutter" },
];

const detailVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

function roleAt(id: RoleId) {
  return ROLES.find((r) => r.id === id)!;
}

/** Mirror wing positions in RTL so start/end still feel natural. */
function courtX(roleId: RoleId, x: number, dir: "rtl" | "ltr") {
  if (dir === "rtl" && (roleId === "frontend" || roleId === "flutter")) {
    return 100 - x;
  }
  return x;
}

/** Pull pass endpoints back so the stroke sits between jerseys, not under them. */
function insetLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  inset = 9,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: x1 + ux * inset,
    y1: y1 + uy * inset,
    x2: x2 - ux * inset,
    y2: y2 - uy * inset,
  };
}

/** Circular HTML ball — stays round even when the court SVG is stretched. */
function PassBall({
  x1,
  y1,
  x2,
  y2,
  delay,
  duration = 2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  duration?: number;
}) {
  const travel = {
    duration,
    delay,
    ease: [0.4, 0, 0.2, 1] as const,
    repeat: Infinity,
    repeatDelay: 0.6,
  };

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute z-[5] h-3 w-3 rounded-full bg-[var(--warm)] shadow-[0_0_10px_3px_color-mix(in_oklab,var(--warm)_65%,transparent)]"
      // Margin centers the 12px ball on the % point (avoid CSS translate — Motion overrides it).
      style={{ marginLeft: -6, marginTop: -6 }}
      initial={{ left: `${x1}%`, top: `${y1}%`, opacity: 0 }}
      animate={{
        left: [`${x1}%`, `${x2}%`],
        top: [`${y1}%`, `${y2}%`],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        left: travel,
        top: travel,
        opacity: {
          ...travel,
          ease: "linear",
          times: [0, 0.12, 0.88, 1],
        },
      }}
    />
  );
}

export function Team() {
  const { t, dir } = useI18n();
  const reduce = useReducedMotion();
  const [activeRole, setActiveRole] = useState<RoleId | null>(null);
  const uid = useId().replace(/:/g, "");

  const toggle = (id: RoleId) => {
    setActiveRole((prev) => (prev === id ? null : id));
  };

  const active = activeRole ? roleAt(activeRole) : null;
  const ActiveIllustration = active?.Illustration;

  const passInvolves = (from: RoleId, to: RoleId) =>
    !activeRole || activeRole === from || activeRole === to;

  return (
    <section
      id="team"
      className="relative overflow-hidden border-t border-border/60 py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute -top-20 end-0 h-80 w-80 translate-x-1/4 rounded-full opacity-35 blur-3xl dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--teal) 30%, transparent), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 start-0 h-72 w-72 -translate-x-1/4 translate-y-1/4 rounded-full opacity-30 blur-3xl dark:opacity-15"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--warm) 28%, transparent), transparent 70%)",
          }}
        />
      </div>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8"
      >
        <motion.span
          variants={fadeUp}
          className="text-sm font-semibold uppercase tracking-widest text-teal-ink"
        >
          {t("team.kicker")}
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          {t("team.title")}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          {t("team.lead")}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-3 text-sm font-medium text-warm"
        >
          {t("team.hint")}
        </motion.p>

        {/* Court lineup */}
        <motion.div
          variants={fadeUp}
          className="relative mt-12 overflow-hidden rounded-[2rem] border border-border/70 bg-card/40 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--foreground)_6%,transparent)] backdrop-blur-sm"
        >
          <div className="relative aspect-[3/4] w-full min-h-[32rem] overflow-hidden sm:aspect-[4/5] sm:min-h-[36rem] lg:aspect-auto lg:min-h-0 lg:h-[min(82vh,48rem)]">
            {/* Court floor markings */}
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 opacity-[0.55] dark:opacity-40"
                style={{
                  background: `
                    radial-gradient(ellipse 55% 40% at ${COURT_HUB.x}% ${COURT_HUB.y}%, color-mix(in oklab, var(--teal) 12%, transparent), transparent 70%),
                    linear-gradient(180deg, color-mix(in oklab, var(--accent) 55%, transparent), transparent 45%)
                  `,
                }}
              />
              {/* Hub circle — same anchor as Backend (left/top %, not logical start) */}
              <div
                className="absolute size-[min(42%,14rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/50"
                style={{ left: `${COURT_HUB.x}%`, top: `${COURT_HUB.y}%` }}
              />
              <div className="absolute left-1/2 top-[8%] h-[28%] w-[min(28%,9rem)] -translate-x-1/2 rounded-b-2xl border border-border/40 border-t-0" />
              <div className="absolute inset-x-6 bottom-[4%] h-px bg-border/50" />
              <div className="absolute inset-y-6 start-4 w-px bg-border/30" />
              <div className="absolute inset-y-6 end-4 w-px bg-border/30" />
            </div>

            {/* Pass lanes — same box as players so % coords align */}
            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <defs>
                {/* userSpaceOnUse: objectBoundingBox breaks on vertical lines (zero width). */}
                <linearGradient
                  id={`${uid}-lane`}
                  gradientUnits="userSpaceOnUse"
                  x1="20"
                  y1="10"
                  x2="80"
                  y2="90"
                >
                  <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.95" />
                  <stop offset="55%" stopColor="var(--teal)" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="var(--warm)" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {PASSES.map(({ from, to }) => {
                const a = roleAt(from);
                const b = roleAt(to);
                const involved = passInvolves(from, to);
                const ax = courtX(from, a.x, dir);
                const bx = courtX(to, b.x, dir);
                const inset = from === "ai" || to === "ai" ? 7 : 9;
                const line = insetLine(ax, a.y, bx, b.y, inset);
                return (
                  <g key={`lane-${from}-${to}`}>
                    <motion.line
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="var(--teal)"
                      strokeWidth={involved ? 2.4 : 1}
                      strokeLinecap="round"
                      strokeOpacity={involved ? 0.28 : 0.08}
                      initial={false}
                      animate={{ opacity: 1 }}
                    />
                    <motion.line
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={`url(#${uid}-lane)`}
                      strokeWidth={involved ? 1.35 : 0.5}
                      strokeLinecap="round"
                      initial={false}
                      animate={{ opacity: involved ? 1 : 0.25 }}
                      transition={{ duration: 0.3 }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Balls as HTML circles — not SVG — so stretch never turns them oval */}
            {!reduce &&
              PASSES.map(({ from, to }) => {
                if (!passInvolves(from, to)) return null;
                const a = roleAt(from);
                const b = roleAt(to);
                const ax = courtX(from, a.x, dir);
                const bx = courtX(to, b.x, dir);
                const inset = from === "ai" || to === "ai" ? 7 : 9;
                const line = insetLine(ax, a.y, bx, b.y, inset);
                const delay =
                  from === "ai" ? 0 : to === "frontend" ? 0.85 : 1.7;
                return (
                  <PassBall
                    key={`ball-${from}-${to}-${dir}`}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    delay={delay}
                    duration={2.1}
                  />
                );
              })}

            {ROLES.map((role, i) => {
              const open = activeRole === role.id;
              const dimmed = activeRole !== null && !open;
              const x = courtX(role.id, role.x, dir);
              // Bottom wings: labels above so they stay inside the court (not over the caption).
              const labelsAbove =
                role.id === "ai" ||
                role.id === "frontend" ||
                role.id === "flutter";

              const labels = (
                <>
                  <span
                    className={cn(
                      "max-w-[7.5rem] rounded-full px-2.5 py-1 text-center text-[11px] font-semibold uppercase tracking-[0.12em] sm:max-w-[9rem] sm:text-xs",
                      "bg-background/85 text-foreground ring-1 ring-border/60 backdrop-blur-sm",
                      open && "text-teal-ink ring-teal/40",
                      dimmed && "opacity-50",
                    )}
                  >
                    {t(`team.roles.${role.id}.tag`)}
                  </span>

                  <span
                    className={cn(
                      "max-w-[9rem] text-center text-xs font-medium leading-snug text-muted-foreground sm:max-w-[11rem] sm:text-sm",
                      open && "text-foreground",
                      dimmed && "opacity-50",
                    )}
                  >
                    {t(`team.roles.${role.id}.title`)}
                  </span>
                </>
              );

              const jersey = (
                <motion.span
                  className={cn(
                    "relative flex size-[4.5rem] items-center justify-center rounded-full border-2 sm:size-[5.25rem]",
                    "bg-card/90 shadow-[0_10px_28px_-12px_color-mix(in_oklab,var(--brand)_45%,transparent)] backdrop-blur-md",
                    "transition-[border-color,box-shadow,opacity] duration-300",
                    open
                      ? "border-teal shadow-[0_0_0_6px_color-mix(in_oklab,var(--teal)_22%,transparent)]"
                      : "border-border/80 hover:border-teal/50",
                    dimmed && "opacity-40",
                  )}
                  animate={
                    open && !reduce
                      ? {
                          boxShadow: [
                            "0 0 0 4px color-mix(in oklab, var(--teal) 18%, transparent)",
                            "0 0 0 10px color-mix(in oklab, var(--teal) 8%, transparent)",
                            "0 0 0 4px color-mix(in oklab, var(--teal) 18%, transparent)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: open && !reduce ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -start-1 -top-1 flex size-7 items-center justify-center rounded-full text-[10px] font-bold tracking-tight ring-2 ring-card sm:size-8 sm:text-xs"
                    style={{
                      background: "var(--brand)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    {role.jersey}
                  </span>

                  <role.Illustration
                    className="size-[70%] p-0.5"
                    active={open}
                  />
                </motion.span>
              );

              return (
                <motion.button
                  key={role.id}
                  type="button"
                  aria-expanded={open}
                  aria-controls="team-role-detail"
                  onClick={() => toggle(role.id)}
                  // Keep x/y in motion style — Tailwind -translate is wiped by whileHover scale.
                  style={{
                    left: `${x}%`,
                    top: `${role.y}%`,
                    x: "-50%",
                    y: "-50%",
                  }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 16,
                    delay: 0.08 * i,
                  }}
                  whileHover={reduce ? undefined : { scale: 1.06 }}
                  whileTap={reduce ? undefined : { scale: 0.96 }}
                  className={cn(
                    "absolute z-10 cursor-pointer outline-none",
                    "focus-visible:ring-2 focus-visible:ring-teal/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                >
                  <span className="relative flex items-center justify-center">
                    {jersey}
                    <span
                      className={cn(
                        "absolute start-1/2 flex w-max -translate-x-1/2 flex-col items-center gap-1.5",
                        labelsAbove
                          ? "bottom-full mb-2"
                          : "top-full mt-2",
                      )}
                    >
                      {labels}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="relative border-t border-border/50 bg-background/40 px-4 py-3 sm:px-6">
            <p className="text-center text-xs text-muted-foreground sm:text-sm">
              {t("team.courtCaption")}
            </p>
          </div>
        </motion.div>

        {/* Role detail — role first, then players */}
        <div className="mt-6 min-h-[12rem]">
          <AnimatePresence mode="wait">
            {active && ActiveIllustration ? (
              <motion.article
                key={active.id}
                id="team-role-detail"
                variants={detailVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  "overflow-hidden rounded-3xl border border-teal/40 bg-card/70",
                  "shadow-[0_16px_48px_-24px_color-mix(in_oklab,var(--teal)_50%,transparent)]",
                )}
              >
                <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div
                    className={cn(
                      "relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[16rem]",
                      "bg-gradient-to-br from-accent/50 via-muted/25 to-transparent",
                    )}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 28% 18%, color-mix(in oklab, var(--teal) 14%, transparent), transparent 55%)",
                      }}
                    />
                    <ActiveIllustration
                      className="relative h-full p-4 sm:p-6"
                      active
                    />
                  </div>

                  <div className="flex flex-col p-5 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-foreground">
                        {t(`team.roles.${active.id}.position`)}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-warm">
                        {t(`team.roles.${active.id}.tag`)}
                      </span>
                    </div>

                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      {t(`team.roles.${active.id}.title`)}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {t(`team.roles.${active.id}.blurb`)}
                    </p>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-teal-ink">
                      {t("team.playersLabel")}
                    </p>

                    <ul className="mt-3 flex flex-col gap-2">
                      {active.members.map((memberId, mi) => (
                        <motion.li
                          key={memberId}
                          initial={{ opacity: 0, x: dir === "rtl" ? 12 : -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.08 + mi * 0.06,
                            type: "spring",
                            stiffness: 220,
                            damping: 22,
                          }}
                          className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-3.5 py-2.5"
                        >
                          <span
                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                            style={{
                              background: "var(--brand)",
                              color: "var(--primary-foreground)",
                            }}
                            aria-hidden="true"
                          >
                            {String(mi + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-medium text-foreground sm:text-base">
                            {t(
                              `team.roles.${active.id}.members.${memberId}`,
                            )}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    <ul className="mt-5 flex flex-col gap-1.5 border-t border-border/50 pt-4">
                      {PASSES.filter(
                        (p) => p.from === active.id || p.to === active.id,
                      ).map((p) => (
                        <li
                          key={`${p.from}-${p.to}`}
                          className="flex items-start gap-2 text-xs text-muted-foreground sm:text-sm"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal"
                          />
                          <span>{t(p.labelKey)}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.div
                      aria-hidden="true"
                      className="mt-5 h-0.5 rounded-full bg-gradient-to-r from-teal to-warm"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        transformOrigin:
                          dir === "rtl" ? "100% 50%" : "0% 50%",
                      }}
                    />
                  </div>
                </div>
              </motion.article>
            ) : (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground"
              >
                {t("team.emptyHint")}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          variants={fadeUp}
          className="mx-auto mt-14 max-w-2xl text-center"
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
