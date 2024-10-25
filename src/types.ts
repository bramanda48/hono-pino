import type { Context } from "@hono/hono";
import type {
  Bindings,
  DestinationStream,
  Level,
  Logger,
  LoggerOptions,
} from "pino";

/**
 * Pino logger options
 */
export interface PinoOptions<ContextKey> {
  /**
   * Context key for logger
   *
   * @default "logger"
   */
  contextKey?: ContextKey;
  /**
   * Header name for Request ID
   *
   * @default "X-Request-ID"
   */
  requestIdKey?: string;
  /**
   * Pino logger instance
   */
  pino?: Logger | LoggerOptions | DestinationStream;
  /**
   * Pino http bindings
   */
  http?: IPinoHttp;
  /**
   * Response time
   *
   * @default true
   */
  responseTime?: boolean;
}

export interface IPinoHttp {
  RequestId(): Promise<string>;

  onRequest(ctx: Context): Bindings;
  onRequestLevel(ctx: Context): Level;
  onRequestMessage(ctx: Context): string;

  onResponse(ctx: Context): Bindings;
  onResponseLevel(ctx: Context): Level;
  onResponseMessage(ctx: Context): string;
}
