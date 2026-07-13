import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Abstract pharmacy nodes on a city grid. Not geographic — thematic. */
const NODES: { x: number; y: number; hub?: boolean; urgent?: boolean }[] = [
  { x: 90, y: 350, hub: true },
  { x: 205, y: 255 },
  { x: 330, y: 330 },
  { x: 300, y: 150 },
  { x: 470, y: 205 },
  { x: 565, y: 340 },
  { x: 660, y: 150, urgent: true },
  { x: 610, y: 80 },
];

/** Faint "considered" connections the planner weighs. */
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [3, 4], [2, 4],
  [4, 5], [4, 6], [6, 7], [5, 6], [0, 2],
];

/** Adjacency built from EDGES, so routes only travel along the grey network. */
const ADJ: Record<number, number[]> = (() => {
  const map: Record<number, number[]> = {};
  for (const [a, b] of EDGES) {
    (map[a] ??= []).push(b);
    (map[b] ??= []).push(a);
  }
  return map;
})();

/** A fresh route: a random walk from the hub (0) along existing edges. */
function makeRoute(): number[] {
  for (let attempt = 0; attempt < 16; attempt++) {
    const path = [0];
    const visited = new Set([0]);
    let current = 0;
    while (path.length < 6) {
      const options = (ADJ[current] ?? []).filter((n) => !visited.has(n));
      if (options.length === 0) break;
      const next = options[Math.floor(Math.random() * options.length)];
      path.push(next);
      visited.add(next);
      current = next;
    }
    if (path.length >= 4) return path;
  }
  return [0, 1, 3, 4, 6, 5]; // fallback — every consecutive pair is an edge
}

function toPath(route: number[]): string {
  return route
    .map((i, idx) => `${idx === 0 ? "M" : "L"}${NODES[i].x},${NODES[i].y}`)
    .join(" ");
}

const STATIC_ROUTE_D = toPath([0, 1, 3, 4, 6, 5]);
const DRAW_SECONDS = 2.8;
const PAUSE_MS = 1000;

export function RouteNetwork({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  const [route, setRoute] = useState<number[]>(makeRoute);
  const routeD = useMemo(() => toPath(route), [route]);

  const pathRef = useRef<SVGPathElement>(null);
  const pauseRef = useRef<number | undefined>(undefined);

  // draw = 0..1 drawing progress; the vehicle rides the drawing tip.
  const draw = useMotionValue(0);
  const cx = useMotionValue(NODES[0].x);
  const cy = useMotionValue(NODES[0].y);

  useMotionValueEvent(draw, "change", (v) => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    if (!len) return;
    const pt = path.getPointAtLength(v * len);
    cx.set(pt.x);
    cy.set(pt.y);
  });

  useEffect(() => {
    if (reduce) return;

    draw.set(0);
    cx.set(NODES[route[0]].x);
    cy.set(NODES[route[0]].y);

    const controls = animate(draw, 1, {
      duration: DRAW_SECONDS,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        pauseRef.current = window.setTimeout(() => {
          draw.set(0); // hide before swap so the new route doesn't flash fully drawn
          setRoute(makeRoute());
        }, PAUSE_MS);
      },
    });

    return () => {
      controls.stop();
      if (pauseRef.current) window.clearTimeout(pauseRef.current);
    };
  }, [route, reduce, draw, cx, cy]);

  return (
    <svg
      viewBox="0 0 760 440"
      className={cn("h-full w-full overflow-visible", className)}
      fill="none"
      role="img"
      aria-label="An intelligent delivery route connecting pharmacy nodes across a city"
    >
      <defs>
        <pattern id="dotgrid" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="var(--muted-foreground)" opacity="0.14" />
        </pattern>
        <radialGradient id="glow" cx="55%" cy="42%" r="55%">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.20" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--warm)" />
        </linearGradient>
      </defs>

      {/* soft glow + map grid */}
      <motion.rect
        x="0" y="0" width="760" height="440"
        fill="url(#glow)"
        initial={reduce ? { opacity: 0.8 } : { opacity: 0.4 }}
        animate={reduce ? { opacity: 0.8 } : { opacity: [0.4, 0.8, 0.4] }}
        transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <rect x="0" y="0" width="760" height="440" fill="url(#dotgrid)" />

      {/* considered connections */}
      <g stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 6">
        {EDGES.map(([a, b], i) => (
          <motion.line
            key={`e-${i}`}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            initial={reduce ? { pathLength: 1, opacity: 0.55 } : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.55 }}
            transition={reduce ? undefined : { duration: 0.9, delay: 0.2 + i * 0.08, ease: EASE }}
          />
        ))}
      </g>

      {/* the route currently being planned — redrawn differently each loop */}
      {reduce ? (
        <path
          d={STATIC_ROUTE_D}
          stroke="url(#routeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <motion.path
          ref={pathRef}
          d={routeD}
          stroke="url(#routeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: draw }}
        />
      )}

      {/* nodes */}
      {NODES.map((n, i) => {
        const color = n.urgent ? "var(--warm)" : "var(--teal)";
        return (
          <g key={`n-${i}`}>
            {!reduce && (
              <motion.circle
                cx={n.x} cy={n.y}
                r={n.hub ? 9 : 7}
                fill={color}
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{ opacity: [0.5, 0, 0.5], scale: [0.8, 2.4, 0.8] }}
                transition={{
                  duration: n.urgent ? 2 : 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2 + i * 0.15,
                }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            )}
            <motion.circle
              cx={n.x} cy={n.y}
              r={n.hub ? 6 : 4.5}
              fill="var(--background)"
              stroke={color}
              strokeWidth={n.hub ? 3 : 2.5}
              initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduce ? undefined : { duration: 0.5, delay: 0.4 + i * 0.1, ease: EASE }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          </g>
        );
      })}

      {/* delivery vehicle riding the drawing tip of the current route */}
      {!reduce && (
        <>
          <motion.circle cx={cx} cy={cy} r={11} fill="var(--warm)" opacity={0.18} />
          <motion.circle
            cx={cx} cy={cy}
            r={5.5}
            fill="var(--warm)"
            stroke="var(--background)"
            strokeWidth={2}
          />
        </>
      )}
    </svg>
  );
}
