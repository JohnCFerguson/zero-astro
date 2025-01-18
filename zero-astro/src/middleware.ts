import type { APIContext, MiddlewareHandler, MiddlewareNext } from "astro";
import type { Schema } from "@rocicorp/zero";
import { getZeroClient } from "./lib";

interface MiddlewareConfig {
  publicServer: string;
  upstreamDb: string;
  cvrDb: string;
  changeDb: string;
  authSecret: string;
  replicaFile: string;
  schema: Schema;
  logLevel?: "debug" | "info" | "error";
  userID?: string;
}

export const createZeroClientMiddleware = (config: MiddlewareConfig): MiddlewareHandler => {
  return async (context: APIContext, next: MiddlewareNext) => {
    try {
      const zeroClient = await getZeroClient({
        server: config.publicServer,
        userID: config.userID ?? 'user',
        schema: config.schema,
        auth: config.authSecret,
        logLevel: config.logLevel ?? 'error',
        kvStore: 'idb',
      });

      if (context.locals) {
        context.locals.zeroClient = zeroClient;
      }

      return next();
    } catch (error) {
      console.error('Zero middleware error:', error);
      return new Response('Zero initialization failed', { status: 500 });
    }
  };
};