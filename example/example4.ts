/**
 * Example 4: Override response message and log
 */

import { Hono } from "@hono/hono";
import { logger } from "../mod.ts";

const app = new Hono().use(logger());

app.get("/", (ctx) => {
  const logger = ctx.get("logger");
  const posts = [
    {
      id: 1,
      title: "Hello World",
      content: "Hello World 1",
    },
    {
      id: 2,
      title: "Lorem ipsum",
      content: "Hello World 2",
    },
    {
      id: 3,
      title: "Dolor sit amet",
      content: "Hello World 3",
    },
  ];

  logger.assign({ posts });
  logger.setResMessage("Get posts success");
  return ctx.text("Override response message and log");
});

Deno.serve({ port: 3000 }, app.fetch);
