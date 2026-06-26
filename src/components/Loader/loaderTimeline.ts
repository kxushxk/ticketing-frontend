import gsap from "gsap";

export interface LoaderTimelineParams {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  logoRef: React.RefObject<HTMLDivElement | null>;
  brandRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.RefObject<HTMLDivElement | null>;
  progressFillRef: React.RefObject<HTMLDivElement | null>;
  textRef: React.RefObject<HTMLDivElement | null>;
  scrollPromptRef: React.RefObject<HTMLDivElement | null>;
  onComplete?: () => void;
}

export function createLoaderTimeline({
  overlayRef,
  logoRef,
  brandRef,
  progressRef,
  progressFillRef,
  textRef,
  scrollPromptRef,
  onComplete,
}: LoaderTimelineParams): gsap.core.Timeline {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = prefersReduced ? 0 : 1;

  const tl = gsap.timeline({
    paused: true,
    onComplete,
  });

  // 1. Overlay fades in
  tl.fromTo(
    overlayRef.current,
    { opacity: 0 },
    { opacity: 1, duration: 0.4 * D, ease: "power2.out" },
    0,
  );

  // 2. Logo: opacity 0 → 1, scale 0.8 → 1, blur 10px → 0
  tl.fromTo(
    logoRef.current,
    { opacity: 0, scale: 0.8, filter: "blur(10px)" },
    {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.2 * D,
      ease: "power3.out",
    },
    0.3,
  );

  // 3. Brand name: fade + slide up
  tl.fromTo(
    brandRef.current,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.8 * D, ease: "power2.out" },
    0.9,
  );

  // 4. Progress container fades in
  tl.fromTo(
    progressRef.current,
    { opacity: 0 },
    { opacity: 1, duration: 0.4 * D },
    1.4,
  );

  // 5. Progress fill: 0 → 1 scaleX
  tl.to(
    progressFillRef.current,
    { scaleX: 1, duration: 2.0 * D, ease: "power2.inOut" },
    1.6,
  );

  // 6. Loading text: fade + slide up
  tl.fromTo(
    textRef.current,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.5 * D },
    1.8,
  );

  // 7. Fade out loading text + progress, fade in "SCROLL TO ENTER"
  tl.to(
    [textRef.current, progressRef.current],
    { opacity: 0, duration: 0.3 * D },
    ">0.6",
  );

  tl.fromTo(
    scrollPromptRef.current,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.6 * D, ease: "power2.out" },
    ">-0.1",
  );

  return tl;
}
