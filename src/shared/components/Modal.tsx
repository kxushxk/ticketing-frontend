import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl dark:border-border-dark dark:bg-surface-dark">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text dark:text-text-dark">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-surface-hover hover:text-muted dark:hover:bg-surface-dark-hover"
          >
            âœ•
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
