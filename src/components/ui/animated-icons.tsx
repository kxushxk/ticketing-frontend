import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useEffect, useState, type ReactNode } from "react";

interface AnimatedCheckmarkProps {
  className?: string;
  size?: number;
  delay?: number;
}

export function AnimatedCheckmark({ className, size = 24, delay = 0 }: AnimatedCheckmarkProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!show) return null;

  return (
    <motion.svg
      className={cn("text-success", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, scale: 0 }}
      animate={{ pathLength: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.path
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
    </motion.svg>
  );
}

interface AnimatedAlertProps {
  className?: string;
  size?: number;
  type?: "error" | "warning" | "info";
}

export function AnimatedAlert({ className, size = 24, type = "warning" }: AnimatedAlertProps) {
  const colorMap = {
    error: "text-earth",
    warning: "text-accent",
    info: "text-info",
  };

  return (
    <motion.svg
      className={cn(colorMap[type], className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      />
      <motion.line
        x1="12" y1="9" x2="12" y2="13"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      <motion.line
        x1="12" y1="17" x2="12.01" y2="17"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      />
    </motion.svg>
  );
}

interface StaggerChildrenProps {
  children: ReactNode[];
  className?: string;
  staggerMs?: number;
}

export function StaggerChildren({ children, className, staggerMs = 50 }: StaggerChildrenProps) {
  return (
    <motion.div
      className={cn("space-y-2", className)}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: staggerMs / 1000 } },
      }}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
