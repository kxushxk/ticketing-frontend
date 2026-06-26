import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { createLoaderTimeline } from "./loaderTimeline";
import { usePreloader } from "./usePreloader";

export function Loader({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState<"loading" | "prompt">("loading");
  const preloader = usePreloader();

  // Called when the initial timeline finishes
  const handleTimelineComplete = useCallback(() => {
    setPhase("prompt");
  }, []);

  // Kick off preloading on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    preloader.start();

    const safety = setTimeout(() => {
      if (!preloader.ready) handleTimelineComplete();
    }, 6000);

    return () => clearTimeout(safety);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build + play timeline once preloading is done
  const timelinePlayed = useRef(false);
  useEffect(() => {
    if (!preloader.ready || timelinePlayed.current) return;
    timelinePlayed.current = true;

    const tl = createLoaderTimeline({
      overlayRef,
      logoRef,
      brandRef,
      progressRef,
      progressFillRef,
      textRef,
      scrollPromptRef,
      onComplete: handleTimelineComplete,
    });

    tl.play();

    return () => {
      tl.kill();
    };
  }, [preloader.ready, handleTimelineComplete]);

  // Scroll-driven reveal — smoothed with rAF
  useEffect(() => {
    if (phase !== "prompt") return;

    const overlay = overlayRef.current;
    const content = contentRef.current;
    const wrapper = wrapperRef.current;
    if (!overlay || !content || !wrapper) return;

    // Enable smooth scrolling on the document
    document.documentElement.style.scrollBehavior = "smooth";

    // Allow real scrolling by adding a spacer for scroll height
    document.body.style.overflow = "auto";
    const spacer = document.createElement("div");
    spacer.style.height = "200vh";
    document.body.prepend(spacer);

    const maxScroll = window.innerHeight;

    let ticking = false;
    let currentScrollY = window.scrollY;

    const update = () => {
      const scrollY = currentScrollY;
      const progress = Math.min(scrollY / maxScroll, 1);

      // Lift overlay upward
      overlay.style.transform = `translate3d(0, -${scrollY}px, 0)`;

      // Fade + slide content in from bottom
      content.style.opacity = String(progress);
      content.style.transform = `translate3d(0, ${(1 - progress) * 50}px, 0)`;

      ticking = false;

      if (progress >= 1) {
        window.removeEventListener("scroll", onScroll);
        document.documentElement.style.scrollBehavior = "";
        spacer.remove();
        document.body.style.overflow = "";
        window.scrollTo(0, 0);
        setDone(true);
      }
    };

    const onScroll = () => {
      currentScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.scrollBehavior = "";
      spacer.remove();
    };
  }, [phase]);

  if (done) return <>{children}</>;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[9999]"
    >
      {/* Overlay — the loading screen, translates up on scroll */}
      <div
        ref={overlayRef}
        className="absolute inset-0 flex select-none flex-col items-center justify-center bg-[#111419] will-change-transform"
        role="progressbar"
        aria-label="Loading application"
        aria-busy={phase === "loading"}
      >
        {/* Logo */}
        <div ref={logoRef} className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="none"
            className="h-16 w-16 sm:h-20 sm:w-20"
          >
            <rect x="4" y="4" width="56" height="56" rx="12" stroke="#F8E794" strokeWidth="3" fill="none" />
            <path d="M20 32 L28 40 L44 24" stroke="#F8E794" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="48" cy="16" r="4" fill="#809076" />
          </svg>
        </div>

        {/* Brand */}
        <div ref={brandRef} className="mt-5 text-center font-display text-2xl tracking-[0.2em] text-white sm:text-3xl">
          TICKETING SYSTEM
        </div>

        {/* Progress bar */}
        <div ref={progressRef} className="mt-12 h-[2px] w-40 overflow-hidden rounded-full bg-white/10 sm:w-56">
          <div ref={progressFillRef} className="h-full origin-left scale-x-0 rounded-full bg-[#F8E794] will-change-transform" />
        </div>

        {/* Loading text */}
        <div ref={textRef} className="mt-4 text-xs tracking-[0.15em] text-white/40 font-body">
          LOADING...
        </div>

        {/* Scroll to enter prompt */}
        <div
          ref={scrollPromptRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
        >
          <span className="text-[10px] tracking-[0.25em] text-white/50 font-display">
            SCROLL TO ENTER
          </span>
          <ChevronDown className="h-5 w-5 text-white/40 animate-bounce" />
        </div>
      </div>

      {/* Content — positioned below the overlay, revealed as overlay scrolls up */}
      <div
        ref={contentRef}
        className="absolute inset-0 overflow-auto opacity-0 will-change-transform"
        style={{ transform: "translateY(50px)" }}
        aria-hidden={!done}
      >
        {children}
      </div>
    </div>
  );
}

export default Loader;
