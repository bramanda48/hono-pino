import type { Context } from "@hono/hono";
import { generate } from "@std/uuid/unstable-v7";
import type { Bindings, Level } from "pino";
import type { IPinoHttp } from "./types.ts";

/**
 * Pino http bindings
 */
export abstract class PinoHttp implements IPinoHttp {
  RequestId(): Promise<string> {
    return Promise.resolve(generate());
  }

  onRequest(ctx: Context): Bindings {
    return {
      req: {
        url: ctx.req.path,
        method: ctx.req.method,
        headers: ctx.req.header(),
      },
    };
  }

  onRequestLevel(): Level {
    return "info";
  }

  onRequestMessage(): string {
    return "Request started";
  }

  onResponse(ctx: Context): Bindings {
    return {
      res: {
        status: ctx.res.status,
        headers: ctx.res.headers,
      },
    };
  }

  onResponseLevel(ctx: Context): Level {
    return ctx.error ? "error" : "info";
  }

  onResponseMessage(ctx: Context): string {
    return ctx.error ? ctx.error.message : "Request completed";
  }
}

export class DefaultPinoHttp extends PinoHttp {}
