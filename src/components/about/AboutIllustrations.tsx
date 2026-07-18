import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

type IllustProps = {
  className?: string;
  active?: boolean;
};

const spring = { type: "spring" as const, stiffness: 180, damping: 22 };

/** Keep an SVG <g> pivoted via the SVG transform attribute (not CSS). */
function useSvgPivot(
  angle: ReturnType<typeof useMotionValue<number>>,
  cx: number,
  cy: number,
) {
  const ref = useRef<SVGGElement>(null);
  const apply = (v: number) => {
    ref.current?.setAttribute("transform", `rotate(${v} ${cx} ${cy})`);
  };
  useMotionValueEvent(angle, "change", apply);
  useEffect(() => {
    apply(angle.get());
  }, [angle, cx, cy]);
  return ref;
}

/** Everyday AI — a glowing core linked to music, chat, and health. */
export function EverydayAI({ className, active }: IllustProps) {
  const reduce = useReducedMotion();
  const pulse = !reduce && active;

  return (
    <svg
      viewBox="0 0 280 220"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="about-ai-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.9" />
          <stop offset="70%" stopColor="var(--teal)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="about-ai-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.15" />
          <stop offset="50%" stopColor="var(--teal)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--warm)" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Soft ambient glow */}
      <motion.circle
        cx="140"
        cy="110"
        r="58"
        fill="url(#about-ai-core)"
        animate={pulse ? { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "140px 110px" }}
      />

      {/* Connection lines */}
      {[
        "M140 110 L70 48",
        "M140 110 L210 48",
        "M140 110 L70 172",
        "M140 110 L210 172",
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="url(#about-ai-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Core node */}
      <motion.circle
        cx="140"
        cy="110"
        r="18"
        fill="var(--teal)"
        fillOpacity="0.2"
        stroke="var(--teal)"
        strokeWidth="2"
        animate={pulse ? { scale: [1, 1.12, 1] } : {}}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "140px 110px" }}
      />
      <circle cx="140" cy="110" r="6" fill="var(--teal)" />

      {/* Orbiting spark */}
      <motion.g
        animate={pulse ? { rotate: 360 } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "140px 110px" }}
      >
        <circle cx="140" cy="62" r="3.5" fill="var(--warm)" />
      </motion.g>

      {/* Satellite nodes — music / chat / health / signal */}
      <Satellite cx={70} cy={48} delay={0.1} active={pulse}>
        <path
          d="M66 52v-8l8-2v10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        />
        <circle cx="66" cy="52" r="2.2" fill="var(--warm)" />
      </Satellite>
      <Satellite cx={210} cy={48} delay={0.2} active={pulse}>
        <path
          d="M204 44h12v8l-3.5-2.5H204z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="text-foreground"
          fill="none"
        />
      </Satellite>
      <Satellite cx={70} cy={172} delay={0.3} active={pulse}>
        <path
          d="M70 166v12M64 172h12"
          stroke="var(--teal)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Satellite>
      <Satellite cx={210} cy={172} delay={0.4} active={pulse}>
        <path
          d="M204 176c0-4 3-7 6-7s6 3 6 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-foreground"
          fill="none"
        />
        <circle cx="210" cy="168" r="2" fill="var(--teal)" />
      </Satellite>
    </svg>
  );
}

function Satellite({
  cx,
  cy,
  delay,
  active,
  children,
}: {
  cx: number;
  cy: number;
  delay: number;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: active ? [1, 1.08, 1] : 1,
      }}
      transition={
        active
          ? { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay }
          : { ...spring, delay }
      }
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <circle
        cx={cx}
        cy={cy}
        r="20"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      {children}
    </motion.g>
  );
}

/** Goods flow — ribbon of parcels moving through a supply arc. */
export function GoodsFlow({ className, active }: IllustProps) {
  const reduce = useReducedMotion();
  const run = !reduce && active;

  return (
    <svg
      viewBox="0 0 280 220"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="about-flow-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.15" />
          <stop offset="50%" stopColor="var(--teal)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--warm)" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Base arc track */}
      <path
        d="M36 160 C80 60, 200 60, 244 160"
        stroke="var(--border)"
        strokeWidth="2"
        strokeDasharray="4 6"
        strokeLinecap="round"
      />

      <motion.path
        d="M36 160 C80 60, 200 60, 244 160"
        stroke="url(#about-flow-arc)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Warehouse / origin */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...spring }}
      >
        <rect
          x="22"
          y="148"
          width="36"
          height="28"
          rx="4"
          fill="var(--card)"
          stroke="var(--brand)"
          strokeWidth="1.5"
        />
        <path
          d="M22 152 L40 138 L58 152"
          stroke="var(--brand)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.g>

      {/* Destination shelves */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, ...spring }}
      >
        <rect
          x="222"
          y="150"
          width="36"
          height="26"
          rx="4"
          fill="var(--card)"
          stroke="var(--teal)"
          strokeWidth="1.5"
        />
        <path
          d="M228 158h24M228 166h24"
          stroke="var(--teal)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Moving parcels along the arc — keyframed along the curve */}
      {(
        [
          [
            { x: 36, y: 154 },
            { x: 90, y: 88 },
            { x: 140, y: 68 },
            { x: 190, y: 88 },
            { x: 236, y: 154 },
          ],
          [
            { x: 36, y: 154 },
            { x: 100, y: 82 },
            { x: 150, y: 66 },
            { x: 200, y: 92 },
            { x: 236, y: 154 },
          ],
          [
            { x: 36, y: 154 },
            { x: 80, y: 100 },
            { x: 130, y: 72 },
            { x: 180, y: 84 },
            { x: 236, y: 154 },
          ],
        ] as const
      ).map((path, i) => {
        const xs = path.map((p) => p.x);
        const ys = path.map((p) => p.y);
        return (
          <motion.rect
            key={i}
            width="14"
            height="12"
            rx="2"
            fill={i === 1 ? "var(--warm)" : "var(--teal)"}
            fillOpacity="0.85"
            initial={{ opacity: 0, x: xs[0], y: ys[0] }}
            animate={
              run
                ? {
                    opacity: [0, 1, 1, 1, 0],
                    x: xs,
                    y: ys,
                  }
                : {
                    opacity: 0.85,
                    x: xs[i + 1] ?? xs[2],
                    y: ys[i + 1] ?? ys[2],
                  }
            }
            transition={
              run
                ? {
                    duration: 2.8,
                    delay: i * 0.55,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.15, 0.5, 0.85, 1],
                  }
                : { delay: 0.5 + i * 0.12, ...spring }
            }
          />
        );
      })}
    </svg>
  );
}

/** Logistics stakes — clock, speedometer, capsule.
 *  Hands pivot from the hub via the SVG transform attribute. */
export function LogisticsStakes({ className, active: _active }: IllustProps) {
  const reduce = useReducedMotion();
  const run = reduce !== true;

  const CY = 110;
  const R = 36;
  const spots = [50, 140, 230] as const;
  /** Left half only — tip to midline. Fill never exceeds this. */
  const CAPSULE_HALF = 16;

  const clockAngle = useMotionValue(0);
  const speedAngle = useMotionValue(0);
  const capsuleFill = useMotionValue(CAPSULE_HALF);
  const clockRef = useSvgPivot(clockAngle, spots[0], CY);
  const speedRef = useSvgPivot(speedAngle, spots[1], CY);
  const capsuleFillRef = useRef<SVGRectElement>(null);

  useMotionValueEvent(capsuleFill, "change", (w) => {
    const el = capsuleFillRef.current;
    if (!el) return;
    el.setAttribute("width", String(Math.max(0, Math.min(CAPSULE_HALF, w))));
  });

  // Clock hand — continuous clockwise sweep (matches the red arrow)
  useEffect(() => {
    if (!run) {
      clockAngle.set(0);
      return;
    }
    const durationMs = 5000;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = ((now - start) % durationMs) / durationMs;
      clockAngle.set(t * 360);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run, clockAngle]);

  // Speedometer — swing left ↔ right from center (matches the red arrows)
  useEffect(() => {
    if (!run) {
      speedAngle.set(0);
      return;
    }
    const durationMs = 2800;
    const span = 55;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      // Smooth ease-in-out oscillation between -span and +span
      const t = ((now - start) % durationMs) / durationMs;
      const wave = Math.sin(t * Math.PI * 2);
      speedAngle.set(wave * span);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run, speedAngle]);

  // Capsule — fill tip→half-line (green), empty half-line→tip (red); capped at midline
  useEffect(() => {
    const el = capsuleFillRef.current;
    if (!run) {
      capsuleFill.set(CAPSULE_HALF);
      el?.setAttribute("width", String(CAPSULE_HALF));
      return;
    }
    const durationMs = 3600;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = ((now - start) % durationMs) / durationMs;
      // 0–0.5 fill toward half-line, 0.5–1 empty back to tip
      const phase = t < 0.5 ? t * 2 : (1 - t) * 2;
      const eased = 0.5 - 0.5 * Math.cos(phase * Math.PI);
      capsuleFill.set(eased * CAPSULE_HALF);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run, capsuleFill]);

  return (
    <svg
      viewBox="0 0 280 220"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      {[
        [spots[0] + R + 4, spots[1] - R - 4],
        [spots[1] + R + 4, spots[2] - R - 4],
      ].map(([x1, x2]) => (
        <motion.line
          key={x1}
          x1={x1}
          y1={CY}
          x2={x2}
          y2={CY}
          stroke="var(--border)"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {spots.map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={CY}
          r={R}
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 + i * 0.1, ...spring }}
          style={{ transformOrigin: `${cx}px ${CY}px` }}
        />
      ))}

      {/* 1 — Clock */}
      <g>
        <circle cx={spots[0]} cy={CY} r="17" stroke="var(--warm)" strokeWidth="2" />
        {[0, 90, 180, 270].map((a) => (
          <line
            key={a}
            x1={spots[0]}
            y1={CY - 15}
            x2={spots[0]}
            y2={CY - 12}
            stroke="var(--warm)"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${a} ${spots[0]} ${CY})`}
          />
        ))}
        <g ref={clockRef}>
          <line
            x1={spots[0]}
            y1={CY}
            x2={spots[0]}
            y2={CY - 13}
            stroke="var(--warm)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
        <circle cx={spots[0]} cy={CY} r="2.5" fill="var(--warm)" />
      </g>

      {/* 2 — Speedometer */}
      <g>
        <path
          d={`M${spots[1] - 14} ${CY + 10} A 17 17 0 1 1 ${spots[1] + 14} ${CY + 10}`}
          stroke="var(--teal)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {[-70, -35, 0, 35, 70].map((a) => (
          <line
            key={a}
            x1={spots[1]}
            y1={CY - 15}
            x2={spots[1]}
            y2={CY - 12}
            stroke="var(--teal)"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${a} ${spots[1]} ${CY})`}
          />
        ))}
        <g ref={speedRef}>
          <line
            x1={spots[1]}
            y1={CY}
            x2={spots[1]}
            y2={CY - 12}
            stroke="var(--foreground)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
        <circle cx={spots[1]} cy={CY} r="2.5" fill="var(--teal)" />
      </g>

      {/* 3 — Capsule: fill tip → half-line; divider + fill clipped inside outline */}
      <g transform={`rotate(-32 ${spots[2]} ${CY})`}>
        <defs>
          <clipPath id="about-capsule-body">
            <rect
              x={spots[2] - 16}
              y={CY - 7}
              width="32"
              height="14"
              rx="7"
            />
          </clipPath>
        </defs>

        {/* Interior only — clipped so nothing can stick out past the pill */}
        <g clipPath="url(#about-capsule-body)">
          <rect
            x={spots[2] - 16}
            y={CY - 7}
            width="32"
            height="14"
            fill="var(--card)"
          />
          {/* Grows tip → midline; hard-capped at CAPSULE_HALF */}
          <rect
            ref={capsuleFillRef}
            x={spots[2] - 16}
            y={CY - 7}
            width={CAPSULE_HALF}
            height="14"
            fill="var(--warm)"
          />
          {/* Divider sits on the half-line, ends flush with the clip (not past the stroke) */}
          <line
            x1={spots[2]}
            y1={CY - 7}
            x2={spots[2]}
            y2={CY + 7}
            stroke="var(--warm)"
            strokeWidth="2"
          />
        </g>

        {/* Outline drawn last — covers any seam gaps at the border */}
        <rect
          x={spots[2] - 16}
          y={CY - 7}
          width="32"
          height="14"
          rx="7"
          fill="none"
          stroke="var(--warm)"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/** Adaptive routes — RL planner drawing a live pharmacy network. */
export function AdaptiveRoutes({ className, active }: IllustProps) {
  const reduce = useReducedMotion();
  const live = !reduce && active;

  const nodes = [
    { x: 48, y: 160, hub: true },
    { x: 100, y: 100 },
    { x: 150, y: 140 },
    { x: 160, y: 60 },
    { x: 220, y: 90 },
    { x: 240, y: 160 },
  ];

  const route = "M48 160 L100 100 L160 60 L220 90 L240 160";

  return (
    <svg
      viewBox="0 0 280 220"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="about-route-glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--warm)" />
        </linearGradient>
        <filter id="about-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Faint candidate edges */}
      {[
        "M48 160 L150 140",
        "M100 100 L150 140",
        "M150 140 L220 90",
        "M160 60 L150 140",
        "M220 90 L240 160",
      ].map((d) => (
        <path
          key={d}
          d={d}
          stroke="var(--border)"
          strokeWidth="1.25"
          strokeOpacity="0.7"
        />
      ))}

      {/* Active RL route */}
      <motion.path
        d={route}
        stroke="url(#about-route-glow)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#about-soft-glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Tracer pulse along route */}
      {live && (
        <motion.circle
          r="5"
          fill="var(--warm)"
          filter="url(#about-soft-glow)"
          initial={{ cx: 48, cy: 160, opacity: 0 }}
          animate={{
            cx: [48, 100, 160, 220, 240],
            cy: [160, 100, 60, 90, 160],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.4,
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />
      )}

      {/* Pharmacy nodes */}
      {nodes.map((n, i) => (
        <motion.g
          key={`${n.x}-${n.y}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.08, ...spring }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        >
          {n.hub ? (
            <>
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="16"
                fill="var(--teal)"
                fillOpacity="0.15"
                animate={live ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r="10"
                fill="var(--card)"
                stroke="var(--teal)"
                strokeWidth="2"
              />
              <path
                d={`M${n.x} ${n.y - 4}v8M${n.x - 4} ${n.y}h8`}
                stroke="var(--teal)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <circle
                cx={n.x}
                cy={n.y}
                r="8"
                fill="var(--card)"
                stroke="var(--brand)"
                strokeWidth="1.5"
              />
              <circle cx={n.x} cy={n.y} r="2.5" fill="var(--teal)" />
            </>
          )}
        </motion.g>
      ))}

      {/* Urgent badge on last node */}
      <motion.circle
        cx="252"
        cy="148"
        r="7"
        fill="var(--warm)"
        initial={{ scale: 0 }}
        animate={live ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={
          live
            ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            : { delay: 0.9, ...spring }
        }
        style={{ transformOrigin: "252px 148px" }}
      />
      <text
        x="252"
        y="151"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="white"
      >
        !
      </text>
    </svg>
  );
}
