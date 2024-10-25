import { createMiddleware } from "@hono/hono/factory";
import { pino, type Logger } from "pino";
import { DefaultPinoHttp } from "./http.ts";
import { PinoLogger } from "./logger.ts";
import type { PinoOptions } from "./types.ts";
import { isEmpty, isPino } from "./utils.ts";

const pinoLogger = <ContextKey extends string = "logger">(
  opts: PinoOptions<ContextKey> = {}
) => {
  opts.http = opts.http || new DefaultPinoHttp();
  opts.responseTime = opts.responseTime || true;

  const rootLogger: Logger = isPino(opts?.pino) ? opts?.pino : pino(opts?.pino);
  const contextKey = opts?.contextKey ?? ("logger" as ContextKey);

  type Env = {
    Variables: {
      [key in ContextKey]: PinoLogger;
    };
  };

  return createMiddleware<Env>(async (ctx, next) => {
    const logger = new PinoLogger(rootLogger);
    ctx.set(contextKey, logger);

    if (isEmpty(opts)) {
      await next();
      return;
    }

    let reqBindings = opts?.http?.onRequest(ctx) ?? {};

    // Generate reqId
    const reqId = await opts?.http?.RequestId();
    const reqName = opts?.requestIdKey ?? "X-Request-ID";
    reqBindings.reqId = reqId;
    ctx.header(reqName, reqId);

    // Log request
    if (opts?.http) {
      const level = opts?.http?.onRequestLevel(ctx);
      const message = opts?.http?.onRequestMessage(ctx);
      logger[level](reqBindings, message);
    }

    if (opts?.responseTime) {
      const startTime = Date.now();
      await next();
      const endTime = Date.now();
      const responseTime = Math.round(endTime - startTime);
      reqBindings.responseTime = responseTime;
    } else {
      await next();
    }

    // Log response
    if (opts?.http) {
      const resBindings = opts?.http?.onResponse(ctx) ?? {};
      reqBindings = Object.assign(reqBindings, resBindings);

      const level = logger.resLevel ?? opts?.http?.onResponseLevel(ctx);
      const message = logger.resMessage ?? opts?.http?.onResponseMessage(ctx);
      logger[level](reqBindings, message);
    }
  });
};

/**
 * Pino logger middleware
 *
 * @example
 * ```ts
 * // default
 * new Hono()
 *   .use(logger())
 *   .get("/", (ctx) => {
 *     const logger = ctx.get("logger");
 *     // or use ctx.var
 *     const logger2 = ctx.var.logger;
 *     return ctx.text("Hello World!");
 *   });
 *
 * // with custom context key
 * new Hono()
 *   .use(logger({ contextKey: "customLogger" }))
 *   .get("/", (ctx) => {
 *     const logger = ctx.get("customLogger");
 *     return ctx.text("Hello World!");
 *   });
 *
 * // with multiple logger
 * new Hono()
 *   .use(logger({ contextKey: "customLogger1" }))
 *   .use(logger({ contextKey: "customLogger2" }))
 *   .get("/", (ctx) => {
 *     const logger1 = ctx.get("customLogger1");
 *     const logger2 = ctx.get("customLogger2");
 *     return ctx.text("Hello World!");
 *   });
 * ```
 */
export const logger = pinoLogger;
