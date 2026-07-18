import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
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

/** AI — the thinking guide that chooses smarter routes. */
export function RoleAI({ className, active }: IllustProps) {
  const reduce = useReducedMotion();
  const live = !reduce && active;
  const uid = useId().replace(/:/g, "");

  const nodes = [
    { x: 70, y: 60 },
    { x: 140, y: 44 },
    { x: 210, y: 60 },
    { x: 90, y: 130 },
    { x: 190, y: 130 },
    { x: 140, y: 156 },
  ];

  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.85" />
          <stop offset="70%" stopColor="var(--teal)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-link`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="var(--teal)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--warm)" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <motion.circle
        cx="140"
        cy="100"
        r="52"
        fill={`url(#${uid}-core)`}
        animate={live ? { scale: [1, 1.1, 1], opacity: [0.65, 1, 0.65] } : {}}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "140px 100px" }}
      />

      {/* Neural links */}
      {[
        "M140 100 L70 60",
        "M140 100 L140 44",
        "M140 100 L210 60",
        "M140 100 L90 130",
        "M140 100 L190 130",
        "M140 100 L140 156",
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke={`url(#${uid}-link)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Core brain node */}
      <motion.circle
        cx="140"
        cy="100"
        r="18"
        fill="var(--card)"
        stroke="var(--teal)"
        strokeWidth="2"
        animate={live ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "140px 100px" }}
      />
      <path
        d="M132 100c0-6 4-10 8-10s8 4 8 10-4 10-8 10-8-4-8-10z"
        stroke="var(--teal-ink)"
        strokeWidth="1.75"
        fill="none"
      />
      <path
        d="M136 96h8M136 104h8"
        stroke="var(--warm)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Orbit spark */}
      <motion.g
        animate={live ? { rotate: 360 } : {}}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "140px 100px" }}
      >
        <circle cx="140" cy="58" r="3.5" fill="var(--warm)" />
      </motion.g>

      {nodes.map((n, i) => (
        <motion.g
          key={`${n.x}-${n.y}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.07, ...spring }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        >
          <circle
            cx={n.x}
            cy={n.y}
            r="9"
            fill="var(--card)"
            stroke="var(--brand)"
            strokeWidth="1.5"
          />
          <motion.circle
            cx={n.x}
            cy={n.y}
            r="3"
            fill={i % 2 === 0 ? "var(--teal)" : "var(--warm)"}
            animate={live ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{
              duration: 1.5,
              delay: i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.g>
      ))}
    </svg>
  );
}
