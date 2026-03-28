import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";

type MorphingTextProps = {
  words: string[];
  className?: string;
  interval?: number;
  animationDuration?: number;
  pauseOnHover?: boolean;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(Boolean(mql.matches));
    onChange();
    if ("addEventListener" in mql) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    (mql as any).addListener(onChange);
    return () => (mql as any).removeListener(onChange);
  }, []);
  return reduced;
}

export default function MorphingText({
  words,
  className,
  interval = 3200,
  animationDuration = 0.35,
  pauseOnHover = true
}: MorphingTextProps) {
  const reduced = usePrefersReducedMotion();
  const safeWords = useMemo(() => (Array.isArray(words) ? words.filter(Boolean) : []), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const [minWidth, setMinWidth] = useState<number | null>(null);
  const swapTimerRef = useRef<number | null>(null);
  const tickTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    if (!safeWords.length) return;

    const el = document.createElement("span");
    el.style.position = "absolute";
    el.style.visibility = "hidden";
    el.style.whiteSpace = "nowrap";
    el.className = className ?? "";
    document.body.appendChild(el);

    let max = 0;
    for (const w of safeWords) {
      el.textContent = w;
      max = Math.max(max, el.getBoundingClientRect().width);
    }
    document.body.removeChild(el);
    setMinWidth(Math.ceil(max));
  }, [safeWords, className]);

  useEffect(() => {
    if (!safeWords.length) return;
    if (paused) return;

    if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
    tickTimerRef.current = window.setInterval(() => {
      if (reduced) {
        setCurrentIndex((prev) => (prev + 1) % safeWords.length);
        return;
      }

      setPhase("exit");
      if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current);
      swapTimerRef.current = window.setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % safeWords.length);
        setPhase("enter");
      }, animationDuration * 1000);
    }, interval);

    return () => {
      if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
      if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current);
    };
  }, [safeWords, paused, interval, animationDuration, reduced]);

  const word = safeWords[currentIndex] ?? "";
  const style = minWidth ? { minWidth: `${minWidth}px` } : undefined;

  return (
    <span
      className={`nl-morph ${className ?? ""}`.trim()}
      style={style}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
      aria-live="polite"
    >
      <span
        className={`nl-morph-word ${phase === "exit" ? "is-exit" : "is-enter"}`.trim()}
        style={reduced ? undefined : { transitionDuration: `${animationDuration}s` }}
      >
        {word}
      </span>
    </span>
  );
}

