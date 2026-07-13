import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { fadeUp, staggerContainer } from "@/lib/motion";

/** Same breakpoint the responsive assets swap at. */
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

const SOURCES = {
  desktop: { video: "/video_cover_desktop.mp4", poster: "/hero-desktop.webp", posterFallback: "/hero-desktop.jpeg" },
  mobile: { video: "/video_covre_mobile.mp4", poster: "/hero-mobile.webp", posterFallback: "/hero-mobile.jpeg" },
} as const;

export function HeroVideo({ inviteeName }: { inviteeName?: string }) {
  const { t, dir } = useI18n();
  const reduce = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const src = isMobile ? SOURCES.mobile : SOURCES.desktop;

  const name = inviteeName?.trim();
  const greeting = name ? t("hero.greeting", { name }) : t("hero.fallbackName");

  return (
    <section
      role="img"
      aria-label={t("hero.coverAlt")}
      className="relative isolate w-full overflow-hidden bg-[#05070c] h-[100svh] md:min-h-svh"
    >
      {/* Base media layer */}
      <div className="absolute inset-0 z-0">
        {reduce ? (
          // Reduced motion: static poster frame, no autoplay.
          <picture>
            <source type="image/webp" srcSet={src.poster} />
            <img
              src={src.posterFallback}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
        ) : (
          <video
            key={isMobile ? "m" : "d"}
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={src.video}
            poster={src.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            disablePictureInPicture
          />
        )}
      </div>

      {/* Vignette — keeps the invitation text legible over the footage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(120% 115% at 50% 42%, transparent 52%, rgba(3,7,18,0.55) 100%)",
        }}
      />

      {/* Bottom scrim (mobile) — darkest at the base, fading up behind the text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[62%] md:hidden"
        style={{
          background:
            "linear-gradient(to top, rgba(3,7,18,0.92) 0%, rgba(3,7,18,0.78) 28%, rgba(3,7,18,0.45) 60%, transparent 100%)",
        }}
      />

      {/* Right scrim (desktop) — darkest at the right edge, fading left behind the text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-[15] hidden w-[62%] md:block"
        style={{
          background:
            "linear-gradient(to left, rgba(3,7,18,0.9) 0%, rgba(3,7,18,0.72) 32%, rgba(3,7,18,0.4) 64%, transparent 100%)",
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
