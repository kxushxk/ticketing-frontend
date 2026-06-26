import { useDarkMode } from "../hooks/useDarkMode";
import { Moon, Sun } from "lucide-react";

function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 text-sm text-muted hover:bg-surface-hover dark:text-muted dark:hover:bg-surface-dark-hover"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export default DarkModeToggle;
