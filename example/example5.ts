/**
 * Example 4: Request and Response bindings
 */

import { Hono } from "@hono/hono";
import { logger, PinoHttp } from "../mod.ts";

export class CustomHttpBindings extends PinoHttp {
  override onRequestMessage(): string {
    return "Custom Request started";
  }

  override onResponseMessage(): string {
    return "Custom Response completed";
  }
}

const app = new Hono().use(
  logger({
    http: new CustomHttpBindings(),
  })
);

app.get("/", (ctx) => {
  const logger = ctx.get("logger");
  logger.info("This is info log");
  return ctx.text("Hello World!");
});

Deno.serve({ port: 3000 }, app.fetch);
