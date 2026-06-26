import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  className?: string;
  size?: number;
  text?: string;
}

export function Spinner({ className, size = 16, text }: SpinnerProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="inline-flex"
      >
        <Loader2 size={size} />
      </motion.span>
      {text && <span className="text-sm text-muted">{text}</span>}
    </span>
  );
}
