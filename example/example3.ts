/**
 * Example 3: With multiple logger
 */
import { Hono } from "@hono/hono";
import { logger } from "../mod.ts";

const app = new Hono()
  .use(logger({ contextKey: "customLogger1" }))
  .use(logger({ contextKey: "customLogger2" }));

app.get("/", (ctx) => {
  const logger1 = ctx.get("customLogger1");
  logger1.info("This is info log 1");

  const logger2 = ctx.get("customLogger2");
  logger2.info("This is info log 2");
  return ctx.text("Hello World!");
});

Deno.serve({ port: 3000 }, app.fetch);
