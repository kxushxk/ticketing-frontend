import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface AnimatedIconProps {
  icon: React.FC<{ className?: string }>;
  className?: string;
  hover?: "pulse" | "spin" | "bounce" | "shake" | "scale" | "glow";
}

const hoverAnimations = {
  pulse: {
    whileHover: { scale: 1.15, opacity: 0.8 },
    whileTap: { scale: 0.95 },
  },
  spin: {
    whileHover: { rotate: 180 },
    whileTap: { rotate: 360 },
    transition: { duration: 0.4 },
  },
  bounce: {
    whileHover: { y: -2 },
    whileTap: { y: 0 },
  },
  shake: {
    whileHover: { x: [0, -2, 2, -1, 1, 0] },
    transition: { duration: 0.3 },
  },
  scale: {
    whileHover: { scale: 1.2 },
    whileTap: { scale: 0.9 },
  },
  glow: {
    whileHover: { scale: 1.1, filter: "brightness(1.3)" },
    whileTap: { scale: 0.95 },
  },
};

export function AnimatedIcon({ icon: Icon, className, hover }: AnimatedIconProps) {
  const motionProps = hover ? hoverAnimations[hover] : {};
  return (
    <motion.span className={cn("inline-flex", className)} {...motionProps}>
      <Icon className="h-full w-full" />
    </motion.span>
  );
}
