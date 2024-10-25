import type { Bindings, Level, LogFn, Logger } from "pino";
import { deepMerge } from "./utils.ts";

export interface PinoLogger {
  trace: LogFn;
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  fatal: LogFn;
}

export class PinoLogger {
  protected rootLogger: Logger;
  protected logger: Logger;

  public resMessage: string | null = null;
  public resLevel: Level | null = null;

  constructor($rootLogger: Logger) {
    this.rootLogger = $rootLogger.child({});
    this.logger = $rootLogger;
  }

  /**
   * Returns the current bindings from http log context.
   *
   * @returns The current bindings.
   */
  bindings(): Bindings {
    return this.logger.bindings();
  }

  /**
   * Clear bindings from http log context.
   */
  clearBindings() {
    this.logger = this.rootLogger.child({});
  }

  /**
   * Assign new bindings to http log context. If `opts.deep` is `true`, the new
   * bindings will be merged with the current bindings using
   * `deepMerge`. Otherwise, the new bindings will be assigned directly to
   * the logger.
   *
   * @param bindings The new bindings to be assigned.
   * @param opts Options for the assignment.
   */
  assign(
    bindings: Bindings,
    opts?: {
      /** deep merge @default false */
      deep?: boolean;
    }
  ) {
    const newBindings = opts?.deep
      ? deepMerge(bindings, this.logger.bindings())
      : { ...this.logger.bindings(), ...bindings };

    this.logger = this.rootLogger.child(newBindings);
  }

  /**
   * Override response log message
   *
   * @param message The message to be set for the response log.
   */
  setResMessage(message: string | null) {
    this.resMessage = message;
  }

  /**
   * Override response log level
   *
   * @param level The level to be set for the response log.
   */
  setResLevel(level: Level | null) {
    this.resLevel = level;
  }
}

PinoLogger.prototype.trace = function (this, ...args: [any, ...any]) {
  this.logger.trace(...args);
};

PinoLogger.prototype.debug = function (this, ...args: [any, ...any]) {
  this.logger.debug(...args);
};

PinoLogger.prototype.info = function (this, ...args: [any, ...any]) {
  this.logger.info(...args);
};

PinoLogger.prototype.warn = function (this, ...args: [any, ...any]) {
  this.logger.warn(...args);
};

PinoLogger.prototype.error = function (this, ...args: [any, ...any]) {
  this.logger.error(...args);
};

PinoLogger.prototype.fatal = function (this, ...args: [any, ...any]) {
  this.logger.fatal(...args);
};
