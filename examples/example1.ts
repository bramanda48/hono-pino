/**
 * Example 1: Default logger
 */

import { Hono } from "@hono/hono";
import { logger } from "../mod.ts";

const app = new Hono().use(logger());

app.get("/", (ctx) => {
  const logger = ctx.get("logger");
  logger.info("This is info log");
  return ctx.text("Hello World!");
});

app.get("/error", async (ctx) => {
  try {
    throw new Error("Something went wrong");
  } catch (e) {
    const logger = ctx.get("logger");
    logger.error(e);
  }
  return ctx.text("Catch the error!");
});

app.get("/wait", (ctx) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ctx.text("Oke! See response time!"));
    }, 2000);
  });
});

Deno.serve({ port: 3000 }, app.fetch);
