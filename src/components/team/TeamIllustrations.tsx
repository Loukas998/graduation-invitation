import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AISparkle, RobotHead } from "@/components/about/AboutIllustrations";
import { cn } from "@/lib/utils";

type IllustProps = {
  className?: string;
  active?: boolean;
};

const spring = { type: "spring" as const, stiffness: 180, damping: 22 };

/** Backend — the hidden kitchen / engine room that powers everything. */
export function RoleBackend({ className, active }: IllustProps) {
  const reduce = useReducedMotion();
  const live = !reduce && active;
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-pipe`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="var(--teal)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--warm)" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.circle
        cx="140"
        cy="100"
        r="70"
        fill={`url(#${uid}-glow)`}
        animate={live ? { scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] } : {}}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "140px 100px" }}
      />

      {/* Server rack */}
      <motion.g
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
      >
        <rect
          x="48"
          y="48"
          width="72"
          height="108"
          rx="10"
          fill="var(--card)"
          stroke="var(--brand)"
          strokeWidth="1.75"
        />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x="58"
              y={62 + i * 28}
              width="52"
              height="18"
              rx="4"
              fill="var(--muted)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <motion.circle
              cx="70"
              cy={71 + i * 28}
              r="3"
              fill="var(--teal)"
              animate={
                live
                  ? { opacity: [0.35, 1, 0.35] }
                  : { opacity: 0.7 }
              }
              transition={{
                duration: 1.2,
                delay: i * 0.25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <rect
              x="80"
              y={68 + i * 28}
              width={28 - i * 4}
              height="6"
              rx="2"
              fill="var(--teal)"
              fillOpacity="0.45"
            />
          </g>
        ))}
      </motion.g>

      {/* Data vault */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...spring, delay: 0.15 }}
        style={{ transformOrigin: "210px 100px" }}
      >
        <rect
          x="176"
          y="62"
          width="64"
          height="76"
          rx="12"
          fill="var(--card)"
          stroke="var(--warm)"
          strokeWidth="1.75"
        />
        <circle
          cx="208"
          cy="96"
          r="14"
          fill="var(--accent)"
          stroke="var(--warm)"
          strokeWidth="1.5"
        />
        <path
          d="M208 90v10M204 96h8"
          stroke="var(--warm)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="196" y="120" width="24" height="6" rx="2" fill="var(--warm)" fillOpacity="0.5" />
      </motion.g>

      {/* Connecting pipes */}
      <motion.path
        d="M120 100 H176"
        stroke={`url(#${uid}-pipe)`}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      {live && (
        <motion.circle
          r="4.5"
          fill="var(--warm)"
          initial={{ cx: 120, opacity: 0 }}
          animate={{ cx: [120, 176], opacity: [0, 1, 0] }}
          style={{ cy: 100 }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.3,
          }}
        />
      )}

      {/* Outgoing signals */}
      {[
        { y: 70, delay: 0 },
        { y: 100, delay: 0.2 },
        { y: 130, delay: 0.4 },
      ].map(({ y, delay }) => (
        <motion.path
          key={y}
          d={`M240 ${y} H262`}
          stroke="var(--teal)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.55"
          animate={live ? { opacity: [0.2, 1, 0.2], x: [0, 4, 0] } : { opacity: 0.55 }}
          transition={{ duration: 1.4, delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

/** Front-end web — admin dashboard with a smart guide chatbot. */
export function RoleFrontend({ className, active }: IllustProps) {
  const reduce = useReducedMotion();
  const live = !reduce && active;
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-bar`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--warm)" />
        </linearGradient>
      </defs>

      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        {/* Browser chrome — dashboard */}
        <rect
          x="28"
          y="32"
          width="168"
          height="136"
          rx="12"
          fill="var(--card)"
          stroke="var(--brand)"
          strokeWidth="1.75"
        />
        <rect x="28" y="32" width="168" height="24" rx="12" fill="var(--muted)" />
        <rect x="28" y="44" width="168" height="12" fill="var(--muted)" />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={42 + i * 12}
            cy="44"
            r="3.5"
            fill={i === 0 ? "var(--warm)" : i === 1 ? "var(--teal)" : "var(--brand)"}
            fillOpacity="0.7"
          />
        ))}

        {/* Sidebar */}
        <rect
          x="36"
          y="64"
          width="28"
          height="92"
          rx="5"
          fill="var(--muted)"
          stroke="var(--border)"
        />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x="42"
            y={72 + i * 18}
            width="16"
            height="8"
            rx="2"
            fill={i === 0 ? "var(--teal)" : "var(--border)"}
            fillOpacity={i === 0 ? 0.7 : 0.8}
          />
        ))}

        {/* KPI strips */}
        <motion.rect
          x="72"
          y="64"
          width="52"
          height="22"
          rx="4"
          fill={`url(#${uid}-bar)`}
          fillOpacity="0.75"
          animate={live ? { opacity: [0.55, 1, 0.55] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <rect x="130" y="64" width="52" height="22" rx="4" fill="var(--accent)" stroke="var(--teal)" strokeWidth="1" />

        {/* Insight text rows (analysis without charts) */}
        <rect x="72" y="96" width="110" height="6" rx="2" fill="var(--border)" />
        <rect x="72" y="108" width="88" height="6" rx="2" fill="var(--border)" fillOpacity="0.75" />
        <rect x="72" y="120" width="98" height="6" rx="2" fill="var(--border)" fillOpacity="0.55" />
        <rect
          x="72"
          y="136"
          width="110"
          height="20"
          rx="5"
          fill="var(--accent)"
          stroke="var(--teal)"
          strokeWidth="1.25"
        />
        <rect x="80" y="142" width="54" height="4" rx="2" fill="var(--teal)" fillOpacity="0.65" />
        <rect x="80" y="150" width="72" height="3" rx="1.5" fill="var(--border)" />

        {/* Smart guide chatbot panel */}
        <motion.g
          animate={live ? { y: [0, -3, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect
            x="206"
            y="52"
            width="52"
            height="100"
            rx="12"
            fill="var(--card)"
            stroke="var(--warm)"
            strokeWidth="1.75"
          />
          <circle cx="232" cy="72" r="10" fill="var(--warm)" fillOpacity="0.2" stroke="var(--warm)" strokeWidth="1.5" />
          <path
            d="M227 72h10M232 67v10"
            stroke="var(--warm)"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Chat bubbles */}
          <rect x="214" y="92" width="28" height="10" rx="4" fill="var(--accent)" />
          <rect x="222" y="108" width="24" height="10" rx="4" fill="var(--muted)" />
          <rect x="214" y="124" width="30" height="10" rx="4" fill="var(--accent)" />
          <circle cx="232" cy="144" r="3" fill="var(--teal)" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

/** Flutter — field mobile app with an onboarding smart guide chatbot. */
export function RoleFlutter({ className, active }: IllustProps) {
  const reduce = useReducedMotion();
  const live = !reduce && active;
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-screen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--muted)" />
        </linearGradient>
        <linearGradient id={`${uid}-route`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--warm)" />
        </linearGradient>
      </defs>

      <motion.g
        initial={{ opacity: 0, rotate: -6, y: 10 }}
        animate={{ opacity: 1, rotate: 0, y: 0 }}
        transition={spring}
        style={{ transformOrigin: "124px 100px" }}
      >
        {/* Phone body */}
        <rect
          x="82"
          y="28"
          width="84"
          height="148"
          rx="16"
          fill="var(--card)"
          stroke="var(--brand)"
          strokeWidth="2"
        />
        <rect
          x="88"
          y="40"
          width="72"
          height="116"
          rx="6"
          fill={`url(#${uid}-screen)`}
        />
        <rect x="112" y="32" width="24" height="4" rx="2" fill="var(--border)" />
        <circle cx="124" cy="166" r="5" stroke="var(--brand)" strokeWidth="1.5" fill="none" />

        {/* Mini map UI */}
        <motion.path
          d="M100 78 L116 62 L136 86 L152 68"
          stroke={`url(#${uid}-route)`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {[
          { x: 100, y: 78 },
          { x: 116, y: 62 },
          { x: 136, y: 86 },
          { x: 152, y: 68 },
        ].map((n, i) => (
          <motion.circle
            key={`${n.x}-${n.y}`}
            cx={n.x}
            cy={n.y}
            r={i === 0 ? 5 : 3.5}
            fill={i === 0 ? "var(--warm)" : "var(--teal)"}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, ...spring }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}

        {/* Coach chat sheet on phone */}
        <motion.rect
          x="96"
          y="108"
          width="56"
          height="40"
          rx="8"
          fill="var(--card)"
          stroke="var(--teal)"
          strokeWidth="1.25"
          animate={live ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "124px 128px" }}
        />
        <rect x="104" y="116" width="26" height="7" rx="3" fill="var(--accent)" />
        <rect x="118" y="128" width="22" height="7" rx="3" fill="var(--muted)" />
        <circle cx="108" cy="142" r="2.5" fill="var(--teal)" />
        <circle cx="116" cy="142" r="2.5" fill="var(--teal)" fillOpacity="0.55" />
        <circle cx="124" cy="142" r="2.5" fill="var(--teal)" fillOpacity="0.3" />
      </motion.g>

      {/* Floating smart guide bubble for new field staff */}
      <motion.g
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...spring, delay: 0.2 }}
      >
        <motion.g
          animate={live ? { y: [0, -4, 0] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect
            x="186"
            y="58"
            width="64"
            height="72"
            rx="14"
            fill="var(--card)"
            stroke="var(--warm)"
            strokeWidth="1.75"
          />
          <circle
            cx="218"
            cy="78"
            r="11"
            fill="var(--warm)"
            fillOpacity="0.18"
            stroke="var(--warm)"
            strokeWidth="1.5"
          />
          <path
            d="M213 78c0-3 2.2-5 5-5s5 2 5 5-2.2 5-5 5"
            stroke="var(--warm)"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="196" y="98" width="36" height="8" rx="3" fill="var(--accent)" />
          <rect x="202" y="112" width="28" height="8" rx="3" fill="var(--muted)" />
          {/* Tail pointing to phone */}
          <path
            d="M186 110 L174 118 L186 122 Z"
            fill="var(--card)"
            stroke="var(--warm)"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        </motion.g>
      </motion.g>
    </svg>
  );
}

/** AI — a thinking brain weighing three candidate routes and locking in the best. */
export function RoleAI({ className, active }: IllustProps) {
  const reduce = useReducedMotion();
  const live = !reduce && active;
  const uid = useId().replace(/:/g, "");

  // Three candidate routes from warehouse (left) to pharmacy (right).
  const routes = {
    top: "M52 96 C 84 44, 176 36, 226 92",
    best: "M52 96 C 104 116, 168 76, 226 92",
    bottom: "M52 96 C 92 168, 188 160, 226 92",
  };

  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-best`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--warm)" />
          <stop offset="55%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--teal)" />
        </linearGradient>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Map dot grid */}
      {[48, 84, 120, 156].map((y) =>
        [64, 104, 144, 184, 224].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="var(--foreground)" fillOpacity="0.1" />
        )),
      )}

      {/* Rejected candidates — considered, then dimmed */}
      {[routes.top, routes.bottom].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="var(--muted-foreground)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="5 6"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            live
              ? { pathLength: 1, opacity: [0, 0.55, 0.22] }
              : { pathLength: 1, opacity: 0.3 }
          }
          transition={{
            pathLength: { duration: 0.9, delay: 0.15 + i * 0.2, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 1.6, delay: 0.15 + i * 0.2, times: [0, 0.55, 1] },
          }}
        />
      ))}

      {/* The chosen route — drawn last, bold, with a traveling delivery dot */}
      <motion.path
        d={routes.best}
        stroke={`url(#${uid}-best)`}
        strokeWidth="3.25"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      />
      {live && (
        <motion.circle
          r="4.5"
          fill="var(--warm)"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2.4,
            delay: 1.2,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeInOut",
          }}
          style={{
            offsetPath: `path("${routes.best}")`,
            offsetRotate: "0deg",
          }}
        />
      )}

      {/* Warehouse depot (start) — pitched roof, big door, stacked parcels */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring, delay: 0.05 }}
        style={{ transformOrigin: "52px 96px" }}
      >
        <path
          d="M34 90 L52 78 L70 90 V110 H34 Z"
          fill="var(--card)"
          stroke="var(--warm)"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        {/* Roll-up door with slats */}
        <rect x="44" y="94" width="16" height="16" fill="var(--warm)" fillOpacity="0.16" stroke="var(--warm)" strokeWidth="1.25" />
        <path d="M44 98.5h16M44 103h16" stroke="var(--warm)" strokeWidth="1" strokeOpacity="0.65" />
        {/* Parcels waiting outside */}
        <rect x="20" y="101" width="9" height="9" rx="1.5" fill="var(--card)" stroke="var(--warm)" strokeWidth="1.25" />
        <path d="M24.5 101v9" stroke="var(--warm)" strokeWidth="1" strokeOpacity="0.7" />
        <rect x="22.5" y="92" width="8" height="8" rx="1.5" fill="var(--card)" stroke="var(--warm)" strokeWidth="1.25" />
        <path d="M26.5 92v8" stroke="var(--warm)" strokeWidth="1" strokeOpacity="0.7" />
      </motion.g>

      {/* Pharmacy storefront (destination) — awning + glowing cross sign */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring, delay: 0.2 }}
        style={{ transformOrigin: "226px 92px" }}
      >
        {live && (
          <motion.circle
            cx="226"
            cy="92"
            r="26"
            fill={`url(#${uid}-halo)`}
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "226px 92px" }}
          />
        )}
        {/* Shop body */}
        <rect x="212" y="88" width="28" height="22" rx="2" fill="var(--card)" stroke="var(--teal)" strokeWidth="1.75" />
        {/* Scalloped awning */}
        <path
          d="M210 88 h32 v-4 h-32 z M210 88 a4 4 0 0 0 8 0 M218 88 a4 4 0 0 0 8 0 M226 88 a4 4 0 0 0 8 0 M234 88 a4 4 0 0 0 8 0"
          fill="var(--teal)"
          fillOpacity="0.3"
          stroke="var(--teal)"
          strokeWidth="1.25"
        />
        {/* Door + shop window */}
        <rect x="217" y="96" width="7" height="14" fill="var(--teal)" fillOpacity="0.25" stroke="var(--teal)" strokeWidth="1.1" />
        <rect x="228" y="96" width="8" height="8" fill="var(--teal)" fillOpacity="0.15" stroke="var(--teal)" strokeWidth="1.1" />
        {/* Cross sign above the shop */}
        <motion.g
          animate={live ? { opacity: [0.75, 1, 0.75] } : {}}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="217" y="66" width="18" height="18" rx="4" fill="var(--card)" stroke="var(--teal)" strokeWidth="1.75" />
          <path d="M226 70v10M221 75h10" stroke="var(--teal-ink)" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>
      </motion.g>

      {/* The AI robot — the decision maker, wired to the chosen route */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.35 }}
      >
        <motion.line
          x1="140"
          y1="54"
          x2="140"
          y2="94"
          stroke="var(--teal)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          strokeOpacity="0.6"
          animate={live ? { strokeDashoffset: [0, -14] } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <RobotHead cx={140} cy={36} scale={0.85} active={live} />
        <AISparkle x={176} y={14} size={5} delay={0.2} active={live} />
      </motion.g>

      {/* Neural layers — the network the robot thinks with */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...spring, delay: 0.5 }}
      >
        <rect
          x="20"
          y="12"
          width="64"
          height="48"
          rx="10"
          fill="var(--card)"
          stroke="var(--teal)"
          strokeWidth="1.5"
          strokeOpacity="0.65"
        />
        {/* Edges between layers */}
        {[34, 52].map((x1) =>
          [24, 36, 48].map((y1) =>
            [24, 36, 48].map((y2) => (
              <line
                key={`${x1}-${y1}-${y2}`}
                x1={x1}
                y1={y1}
                x2={x1 + 18}
                y2={y2}
                stroke="var(--teal)"
                strokeWidth="0.75"
                strokeOpacity="0.3"
              />
            )),
          ),
        )}
        {/* Nodes — signal ripples through the columns when thinking */}
        {[34, 52, 70].map((x, col) =>
          [24, 36, 48].map((y, row) => (
            <motion.circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="3"
              fill={col === 2 ? "var(--warm)" : "var(--teal)"}
              animate={live ? { opacity: [0.3, 1, 0.3], scale: [0.85, 1.25, 0.85] } : { opacity: 0.75 }}
              transition={{
                duration: 1.5,
                delay: col * 0.25 + row * 0.06,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
          )),
        )}
        {/* Wire into the robot */}
        <motion.line
          x1="84"
          y1="36"
          x2="114"
          y2="36"
          stroke="var(--teal)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          strokeOpacity="0.6"
          animate={live ? { strokeDashoffset: [0, -14] } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.g>

      {/* Reward loop — the star the robot learns to chase */}
      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...spring, delay: 0.6 }}
      >
        <motion.line
          x1="166"
          y1="36"
          x2="212"
          y2="36"
          stroke="var(--warm)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          strokeOpacity="0.55"
          animate={live ? { strokeDashoffset: [0, 14] } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {/* Circulating feedback ring */}
        <motion.g
          animate={live ? { rotate: 360 } : {}}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "230px 36px" }}
        >
          <circle
            cx="230"
            cy="36"
            r="15"
            fill="none"
            stroke="var(--warm)"
            strokeWidth="1.5"
            strokeDasharray="6 5"
            strokeOpacity="0.7"
          />
          <path d="M226 17.5 L234 21 L226.5 25.5 Z" fill="var(--warm)" fillOpacity="0.9" />
        </motion.g>
        {/* Reward star — plain <g> holds the translate; Motion's scale transform
            would otherwise wipe the SVG transform attribute and dump it at 0,0 */}
        <g transform="translate(230 36)">
          <motion.path
            d="M0,-7 L1.65,-2.27 L6.66,-2.16 L2.66,0.87 L4.11,5.66 L0,2.8 L-4.11,5.66 L-2.66,0.87 L-6.66,-2.16 L-1.65,-2.27 Z"
            fill="var(--warm)"
            animate={live ? { scale: [1, 1.3, 1], opacity: [0.75, 1, 0.75] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "0px 0px" }}
          />
        </g>
      </motion.g>

      {live && (
        <>
          {/* "+1" reward pops when the delivery lands… */}
          <motion.text
            x="248"
            y="76"
            fill="var(--warm)"
            fontSize="12"
            fontWeight="700"
            fontFamily="ui-monospace, monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], y: [0, -14] }}
            transition={{
              duration: 1.2,
              delay: 3.5,
              repeat: Infinity,
              repeatDelay: 1.7,
              ease: "easeOut",
            }}
          >
            +1
          </motion.text>
          {/* …and travels back to the robot: the learning loop closes */}
          <motion.path
            d="M0,-4.5 L1.06,-1.46 L4.28,-1.39 L1.71,0.56 L2.64,3.64 L0,1.8 L-2.64,3.64 L-1.71,0.56 L-4.28,-1.39 L-1.06,-1.46 Z"
            fill="var(--warm)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.1,
              delay: 3.7,
              repeat: Infinity,
              repeatDelay: 1.8,
              ease: "easeInOut",
            }}
            style={{
              offsetPath: 'path("M226 74 C 232 44, 196 18, 164 28")',
              offsetRotate: "0deg",
            }}
          />
        </>
      )}

      {/* Checkmark seal on the chosen route */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring, delay: 1.5 }}
        style={{ transformOrigin: "140px 99px" }}
      >
        <circle cx="140" cy="99" r="10" fill="var(--teal)" />
        <path
          d="M135.5 99l3 3 6-6"
          stroke="var(--primary-foreground)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.g>
    </svg>
  );
}
