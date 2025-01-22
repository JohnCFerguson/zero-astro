import type { APIContext, MiddlewareHandler, MiddlewareNext } from "astro";
import type { ZeroConfig } from "./lib/ZeroClient.astro";
import type { Schema } from "@rocicorp/zero";

export const createZeroClientMiddleware = (config: ZeroConfig<Schema>): MiddlewareHandler => {
  return async (context: APIContext, next: MiddlewareNext) => {
    // Only inject config, don't create client
    context.locals.zeroConfig = config;
    return await next();
  };
};