/**
 * Logger utility for standardized logging across the application
 * Especially useful for authentication and Supabase-related logs
 */

import { pino } from "pino";

// Define a type for log options for better type-safety
interface LogOptions {
  module: string;
  context?: Record<string, any>;
}

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

const log = (level: LogLevel, message: string, context?: object) => {
  const timestamp = new Date().toISOString();
  const contextString = context
    ? `\nContext: ${JSON.stringify(context, null, 2)}`
    : "";

  if (
    process.env.NODE_ENV !== "production" ||
    level === "ERROR" ||
    level === "WARN"
  ) {
    console.log(`[${timestamp}] [${level}] ${message}${contextString}`);
  }
};

export const logger = {
  debug: (message: string, context?: object) => log("DEBUG", message, context),
  info: (message: string, context?: object) => log("INFO", message, context),
  warn: (message: string, context?: object) => log("WARN", message, context),
  error: (message: string, error?: any, context?: object) => {
    const errorContext = {
      ...context,
      errorMessage: error?.message,
      errorStack: error?.stack,
    };
    log("ERROR", message, errorContext);
  },
};

/**
 * Utility for Supabase-specific logging
 */
export const supabaseLogger = {
  debug: (message: string, options?: Omit<LogOptions, "module">) =>
    logger.debug(message, { ...options, module: "Supabase" }),
  info: (message: string, options?: Omit<LogOptions, "module">) =>
    logger.info(message, { ...options, module: "Supabase" }),
  warn: (message: string, options?: Omit<LogOptions, "module">) =>
    logger.warn(message, { ...options, module: "Supabase" }),
  error: (
    message: string,
    error?: Error | unknown,
    options?: Omit<LogOptions, "module">,
  ) => logger.error(message, error, { ...options, module: "Supabase" }),
};
