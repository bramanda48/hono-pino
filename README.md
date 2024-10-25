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

Install `@bramanda48/hono-pino` using `deno add`:

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
For more sample, you can see in [Example folder](https://github.com/bramanda48/hono-pino/tree/master/example)

## Options

```ts
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
```

## Request and Response Bindings

With bindings you can feel free to custom the request and response log. you just create class to custom it. For example.

```ts

import { logger } from "@bramanda48/hono-pino";

export class CustomHttpBindings extends PinoHttp {
  override RequestId(): Promise<string> {
    return Promise.resolve(crypto.randomUUID());
  }

  override onRequest(ctx: Context): Bindings {
    return {
      req: {
        url: ctx.req.path,
        method: ctx.req.method,
        headers: ctx.req.header(),
      },
    };
  }

  override onRequestLevel(): Level {
    return "info";
  }

  override onRequestMessage(): string {
    return "Request started";
  }

  override onResponse(ctx: Context): Bindings {
    return {
      res: {
        status: ctx.res.status,
        headers: ctx.res.headers,
      },
    };
  }

  override onResponseLevel(ctx: Context): Level {
    return ctx.error ? "error" : "info";
  }

  override onResponseMessage(ctx: Context): string {
    return ctx.error ? ctx.error.message : "Request completed";
  }
}
```

After that, just add it to logger configuration.

```ts
import { Hono } from "@hono/hono";
import { logger } from "@bramanda48/hono-pino";

const app = new Hono().use(logger({
  http: new CustomHttpBindings()
}));

```

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/bramanda48/hono-pino/blob/master/LICENSE.md) file for details.

## Acknowledgments

The code in this repository is a rewrite for deno. Original source code can be found in here [maou-shonen/hono-pino](https://github1s.com/maou-shonen/hono-pino). 
