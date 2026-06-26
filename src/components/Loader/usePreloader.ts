import { useCallback, useRef, useState } from "react";

export interface PreloadState {
  ready: boolean;
  progress: number;
  start: () => void;
}

let globalPreloaded = false;

export function usePreloader(): PreloadState {
  const [ready, setReady] = useState(globalPreloaded);
  const [progress, setProgress] = useState(globalPreloaded ? 1 : 0);
  const startedRef = useRef(globalPreloaded);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const imagePromises: Promise<void>[] = [];

    // Preload images with data-preload attribute
    document
      .querySelectorAll<HTMLImageElement>("img[data-preload]")
      .forEach((img) => {
        if (img.complete) return;
        imagePromises.push(
          new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
        );
      });

    // If nothing to preload, finish after a small delay for fonts
    if (imagePromises.length === 0) {
      const timeout = setTimeout(() => {
        setProgress(1);
        setReady(true);
        globalPreloaded = true;
      }, 400);
      startedRef.current = timeout;
      return;
    }

    let completed = 0;
    const total = imagePromises.length;

    imagePromises.forEach((p) =>
      p.then(() => {
        completed++;
        setProgress(completed / total);
        if (completed >= total) {
          setReady(true);
          globalPreloaded = true;
        }
      }),
    );
  }, []);

  return { ready, progress, start };
}
