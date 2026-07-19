import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Overlay scrollbar that floats ON TOP of the page, so it reads as liquid
 * glass over the hero video and content alike. The native scrollbar (whose
 * gutter can never be transparent) is hidden in index.css.
 *
 * Mouse/trackpad only — touch devices keep their own overlay scrollbars.
 */
export function GlassScrollbar() {
  const { scrollYProgress } = useScroll();
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbH, setThumbH] = useState(96);
  const [finePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches,
  );
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const hideTimer = useRef<number>(0);
  const dragging = useRef(false);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const ratio =
        window.innerHeight / document.documentElement.scrollHeight;
      setThumbH(
        Math.max(56, Math.min(track.clientHeight, track.clientHeight * ratio)),
      );
    };
    // ResizeObserver delivers an initial callback on observe — that covers
    // the first measurement without a synchronous setState here.
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  // Appear while scrolling, fade out when idle — macOS overlay behavior.
  useMotionValueEvent(scrollYProgress, "change", () => {
    setVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setVisible(false), 1500);
  });

  const y = useTransform(scrollYProgress, (v) => {
    const trackH = trackRef.current?.clientHeight ?? 0;
    return v * Math.max(0, trackH - thumbH);
  });

  const scrollToPointer = (clientY: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const p = Math.min(
      1,
      Math.max(0, (clientY - rect.top - thumbH / 2) / (rect.height - thumbH)),
    );
    const doc = document.documentElement;
    window.scrollTo({ top: p * (doc.scrollHeight - window.innerHeight) });
  };

  if (!finePointer) return null;

  const shown = visible || hovered;

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className={cn(
        "fixed inset-y-2 end-1 z-[70] w-3.5 transition-opacity duration-500",
        shown ? "opacity-100" : "opacity-0",
        shown ? "pointer-events-auto" : "pointer-events-none",
      )}
      onMouseEnter={() => {
        setHovered(true);
        window.clearTimeout(hideTimer.current);
      }}
      onMouseLeave={() => {
        setHovered(false);
        hideTimer.current = window.setTimeout(() => setVisible(false), 800);
      }}
      onPointerDown={(e) => {
        // Click anywhere on the rail jumps there; the thumb then captures drags.
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        scrollToPointer(e.clientY);
      }}
      onPointerMove={(e) => {
        if (dragging.current) scrollToPointer(e.clientY);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <motion.div
        style={{ y, height: thumbH }}
        className={cn(
          "mx-auto w-[7px] cursor-grab rounded-full active:cursor-grabbing",
          "border border-white/30",
          // Single brand navy — #1a3c6e in light, its lighter twin in dark
          // so it stays visible over the dark background.
          "bg-brand/80 hover:bg-brand",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_10px_rgba(0,0,0,0.35)]",
          "backdrop-blur-md transition-[width,background-color] duration-200 hover:w-[10px]",
        )}
      />
    </div>
  );
}
