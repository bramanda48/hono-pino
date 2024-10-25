<a name="readme-top"></a>

<div align="center">
  <a href="https://github.com/bramanda48/hono-pino">
    <img src="https://avatars.githubusercontent.com/u/23048140" alt="Typescript" width="150px">
  </a>
  <h2 align="center">@bramanda48/hono-pino</h2>
  <div align="center">
    <p align="center">A middleware for handling logging with Pino for Hono</p>
    <div>
        <a href="https://github.com/bramanda48/hono-pino/releases/"><img src="https://img.shields.io/github/release/bramanda48/hono-pino?include_prereleases=&sort=semver&color=blue" alt="GitHub release"></a>
        <a href="https://github.com/bramanda48/hono-pino#license"><img src="https://img.shields.io/badge/License-MIT-blue" alt="License"></a>
    </div>
  </div>
</div>

## Installation & Usage

Install @bramanda48/hono-pino using `deno add`:

```bash
deno add jsr:@bramanda48/hono-pino
```

Example usage :

```ts
import { Hono } from "@hono/hono";
import { logger } from "@bramanda48/hono-pino";

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
```
For more sample, you can see in [examples folder](https://github.com/bramanda48/hono-pino)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/bramanda48/hono-pino/blob/master/LICENSE.md) file for details.

## Acknowledgments

The code in this repository is a rewrite for deno. Original source code can be found in here [maou-shonen/hono-pino](https://github1s.com/maou-shonen/hono-pino). 
