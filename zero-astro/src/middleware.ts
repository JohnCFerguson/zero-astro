import type { APIContext, MiddlewareHandler, MiddlewareNext } from "astro";
import { getZeroClient } from "./lib";
import { schema } from "./zero-schema";

export const setupZeroClient: MiddlewareHandler = async ( context: APIContext, next: MiddlewareNext) => {
    const zeroClient = await getZeroClient({
        url: import.meta.env.PUBLIC_SERVER,
        schema: {
            version: 1,
            tables: schema.tables
        }
    });
    
    if (context.locals) {
        context.locals.zeroClient = zeroClient;
    }
    return next();
};