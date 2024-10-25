/**
 * Example 2: With custom context key
 */
import { Hono } from "@hono/hono";
import { logger } from "../mod.ts";

const app = new Hono().use(logger({ contextKey: "customLogger" }));

app.get("/", (ctx) => {
  const logger = ctx.get("customLogger");
  logger.info("This is info log");
  return ctx.text("Hello World!");
});

Deno.serve({ port: 3000 }, app.fetch);
