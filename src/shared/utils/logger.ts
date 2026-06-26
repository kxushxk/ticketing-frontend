type LogLevel = "debug" | "info" | "warn" | "error";

const isDev = import.meta.env.DEV;

function log(level: LogLevel, ...args: unknown[]) {
  if (!isDev && level === "debug") return;
  const prefix = `[${level.toUpperCase()}]`;
  switch (level) {
    case "error":
      console.error(prefix, ...args);
      break;
    case "warn":
      console.warn(prefix, ...args);
      break;
    default:
      console.log(prefix, ...args);
  }
}

export const logger = {
  debug: (...args: unknown[]) => log("debug", ...args),
  info: (...args: unknown[]) => log("info", ...args),
  warn: (...args: unknown[]) => log("warn", ...args),
  error: (...args: unknown[]) => log("error", ...args),
};
