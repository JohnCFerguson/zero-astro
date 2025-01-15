import type { AstroIntegration, MiddlewareHandler} from 'astro';
import { getZeroClient } from './lib/ZeroClient.astro';

function zeroIntegration(): AstroIntegration {
  return {
    name: 'zero-astro',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            optimizeDeps: {
              include: ['@rocicorp/zero']
            },
            ssr: {
              noExternal: ['@rocicorp/zero']
            }
          }
        });
      },
      'astro:server:setup': async ({ server }) => {
        const handler: MiddlewareHandler = async (context, next) => {
          if (!context.locals.zeroClient) {
            context.locals.zeroClient = getZeroClient({
              url: import.meta.env.PUBLIC_SERVER,
              schema: context.locals.schema
            });
          }
          
          return next();
        };
        
        server.middlewares.use(handler);
      }
    }
  };
}

export default zeroIntegration;
export * from './lib/ZeroClient.astro';
