import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { fadeUp, staggerContainer } from "@/lib/motion";

/* ------------------------------------------------------------------ *
 *  Per-breakpoint layout config.
 *  Points are PERCENTAGES of the image; the SVG viewBox uses the image's
 *  native pixel size and `preserveAspectRatio="xMidYMid slice"`, so the
 *  overlay tracks the base image's `object-cover object-center` crop.
 * ------------------------------------------------------------------ */
type Pt = [number, number];

interface CoverConfig {
  vb: { w: number; h: number };
  nodes: Pt[];
  /** Ordered points; rendered as a smooth catmull-rom curve. */
  paths: Pt[][];
  nodeR: number;
  glowWidth: number;
  coreWidth: number;
}

const DESKTOP: CoverConfig = {
  vb: { w: 1024, h: 576 },
  nodes: [
    [16, 86], [6, 71], [24, 64], [35, 78],
    [46, 79], [45, 61], [56, 68], [44, 47],
  ],
  paths: [
    [[16, 86], [20, 74], [24, 64], [34, 54], [44, 47]],   // A: cluster -> horizon
    [[6, 71], [20, 67], [33, 64], [45, 61], [57, 67]],     // B: across the middle (stops before text zone)
    [[16, 86], [30, 80], [46, 79], [58, 80], [76, 86]],    // C: bottom sweep -> right
  ],
  nodeR: 11,
  glowWidth: 7,
  coreWidth: 2.2,
};

const MOBILE: CoverConfig = {
  vb: { w: 576, h: 1024 },
  // First 6 (used on device) are spread across the cluster.
  nodes: [
    [38, 29], [9, 19], [56, 16], [42, 13],
    [75, 24], [24, 17], [45, 22], [26, 9],
  ],
  paths: [
    [[38, 29], [32, 38], [29, 47], [31, 56], [29, 63]],   // left curve
    [[42, 29], [45, 40], [49, 50], [48, 58], [50, 64]],   // center snake
    [[56, 25], [64, 36], [71, 45], [71, 55], [70, 63]],   // right curve
  ],
  nodeR: 15,
  glowWidth: 9,
  coreWidth: 3,
};

const AMBER = "#FB923C";
const AMBER_CORE = "#FFD9A8";

/** Traveling-light durations (s) — deliberately co-prime-ish so they never sync. */
const LIGHT_DURATIONS = [5, 6, 7];
/** Linear-ish cubic-bezier (never a spring) for motion along a path. */
const LIGHT_EASE: [number, number, number, number] = [0.37, 0, 0.63, 1];

/* ------------------------------------------------------------------ *
 *  Small hooks
 * ------------------------------------------------------------------ */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function useSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ width: r.width, height: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/* ------------------------------------------------------------------ *
 *  Geometry helpers
 * ------------------------------------------------------------------ */
/** Percent points -> smooth SVG path in the config's pixel space. */
function toSmoothPath(pts: Pt[], vb: { w: number; h: number }): string {
  const p = pts.map<Pt>(([x, y]) => [(x / 100) * vb.w, (y / 100) * vb.h]);
  if (p.length < 2) return "";
  let d = `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Deterministic PRNG so particle seeds are stable across renders. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Particle {
  left: number;
  size: number;
  duration: number;
  delay: number;
  repeatDelay: number;
  sway: number;
  peak: number;
}

function makeParticles(count: number): Particle[] {
  const rand = mulberry32(count * 9973 + 12345);
  return Array.from({ length: count }, () => ({
    left: rand() * 100,
    size: 2 + rand() * 1.5, // 2–3.5px
    duration: 8 + rand() * 7, // 8–15s
    delay: rand() * 12,
    repeatDelay: rand() * 4,
    sway: (rand() * 2 - 1) * 22, // ±22px horizontal drift
    peak: 0.35 + rand() * 0.4, // 0.35–0.75
  }));
}

/* ------------------------------------------------------------------ *
 *  Sub-layers
 * ------------------------------------------------------------------ */
function TravelingLight({
  d,
  duration,
  glowWidth,
  coreWidth,
}: {
  d: string;
  duration: number;
  glowWidth: number;
  coreWidth: number;
}) {
  // pathLength normalizes dash math to a 0–100 space regardless of geometry.
  const dash = 14;
  const shared = {
    d,
    pathLength: 100,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeDasharray: `${dash} 1000`,
    initial: { strokeDashoffset: dash },
    animate: { strokeDashoffset: -100 },
    transition: {
      duration,
      ease: LIGHT_EASE,
      repeat: Infinity,
      repeatDelay: duration * 0.35,
    },
  };
  return (
    <>
      <motion.path {...shared} stroke={AMBER} strokeWidth={glowWidth} strokeOpacity={0.85} filter="url(#heroGlow)" />
      <motion.path {...shared} stroke={AMBER_CORE} strokeWidth={coreWidth} strokeOpacity={0.95} />
    </>
  );
}

function AnimatedOverlay({
  cfg,
  nodeCount,
}: {
  cfg: CoverConfig;
  nodeCount: number;
}) {
  const paths = useMemo(
    () => cfg.paths.map((pts) => toSmoothPath(pts, cfg.vb)),
    [cfg],
  );
  const nodes = cfg.nodes.slice(0, nodeCount);

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      style={{ mixBlendMode: "screen" }}
      viewBox={`0 0 ${cfg.vb.w} ${cfg.vb.h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="heroNodeGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Node pulse — existing hexagons appear to breathe */}
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={`n${i}`}
          cx={(x / 100) * cfg.vb.w}
          cy={(y / 100) * cfg.vb.h}
          r={cfg.nodeR}
          fill={AMBER}
          filter="url(#heroNodeGlow)"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
          transition={{
            duration: 3 + (i % 3) * 0.5, // 3–4s
            ease: "easeInOut",
            repeat: Infinity,
            delay: (i * 0.37) % 2.5,
          }}
        />
      ))}

      {/* Traveling light along the existing routes */}
      {paths.map((d, i) => (
        <TravelingLight
          key={`p${i}`}
          d={d}
          duration={LIGHT_DURATIONS[i % LIGHT_DURATIONS.length]}
          glowWidth={cfg.glowWidth}
          coreWidth={cfg.coreWidth}
        />
      ))}
    </svg>
  );
}

function ParticleField({
  count,
  height,
}: {
  count: number;
  height: number;
}) {
  const particles = useMemo(() => makeParticles(count), [count]);
  if (height <= 0) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-[11] overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size,
            background: AMBER,
            filter: "blur(0.6px)",
            mixBlendMode: "screen",
            willChange: "transform",
          }}
          initial={{ y: height, x: 0, opacity: 0 }}
          animate={{
            y: [height, height * 0.6, height * 0.2, -20],
            x: [0, p.sway, -p.sway * 0.6, p.sway * 0.2],
            opacity: [0, p.peak, p.peak, 0],
          }}
          transition={{
            duration: p.duration,
            times: [0, 0.2, 0.8, 1],
            ease: "linear",
            repeat: Infinity,
            delay: p.delay,
            repeatDelay: p.repeatDelay,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Main component
 * ------------------------------------------------------------------ */
export function HeroCover({ inviteeName }: { inviteeName?: string }) {
  const { t, dir } = useI18n();
  const reduce = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const containerRef = useRef<HTMLElement>(null);
  const { height } = useSize(containerRef);

  const cfg = isMobile ? MOBILE : DESKTOP;
  const nodeCount = isMobile ? 6 : 8;
  const particleCount = isMobile ? 8 : 14;

  const name = inviteeName?.trim();
  const greeting = name ? t("hero.greeting", { name }) : t("hero.fallbackName");

  return (
    <section
      ref={containerRef}
      role="img"
      aria-label={t("hero.coverAlt")}
      className="relative isolate w-full overflow-hidden bg-[#05070c] h-[100svh] md:min-h-svh"
    >
      {/* 1–4: Ken Burns wrapper keeps the base image + SVG overlay locked together */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={false}
        animate={reduce ? undefined : { scale: [1, 1.04] }}
        transition={
          reduce
            ? undefined
            : { duration: 30, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
        }
        style={{ willChange: reduce ? undefined : "transform" }}
      >
        {/* Base image — responsive WebP with JPG fallback, priority load */}
        <picture>
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet="/hero-mobile.webp"
          />
          <source media="(max-width: 767px)" srcSet="/hero-mobile.jpeg" />
          <source type="image/webp" srcSet="/hero-desktop.webp" />
          <img
            src="/hero-desktop.jpeg"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </picture>

        {!reduce && <AnimatedOverlay cfg={cfg} nodeCount={nodeCount} />}
      </motion.div>

      {/* 5: Particle drift */}
      {!reduce && <ParticleField count={particleCount} height={height} />}

      {/* 6: Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(120% 115% at 50% 42%, transparent 52%, rgba(3,7,18,0.55) 100%)",
        }}
      />

      {/* Invitation text overlay */}
      <motion.div
        variants={reduce ? undefined : staggerContainer(0.09, 0.15)}
        initial={reduce ? undefined : "hidden"}
        animate={reduce ? undefined : "visible"}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-[14svh] text-center
                   md:inset-y-0 md:inset-x-auto md:right-0 md:flex md:w-[46%] md:flex-col md:justify-center md:px-10 md:pb-0 md:text-start lg:pe-16"
      >
        <motion.span
          variants={reduce ? undefined : fadeUp}
          className="mx-auto mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md md:mx-0"
        >
          <span className="size-1.5 rounded-full bg-[#FB923C]" aria-hidden="true" />
          {t("hero.kicker")}
        </motion.span>

        <motion.p
          variants={reduce ? undefined : fadeUp}
          className="text-lg font-medium text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] sm:text-xl"
        >
          {greeting}
        </motion.p>

        <motion.p
          variants={reduce ? undefined : fadeUp}
          className="mt-2 max-w-md text-sm text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-base md:mx-0"
        >
          {t("hero.lead")}
        </motion.p>

        <motion.h1
          variants={reduce ? undefined : fadeUp}
          className="mt-3 font-sans text-[2.75rem] font-semibold leading-none tracking-tight sm:text-6xl xl:text-7xl"
        >
          <span className="text-gradient-brand">IntelliPharma</span>
        </motion.h1>

        <motion.p
          variants={reduce ? undefined : fadeUp}
          className="mx-auto mt-4 max-w-md text-balance text-sm leading-relaxed text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-base md:mx-0"
          dir={dir}
        >
          {t("hero.subtitle")}
        </motion.p>
      </motion.div>
    </section>
  );
}
