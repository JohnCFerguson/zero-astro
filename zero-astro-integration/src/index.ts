import type { AstroIntegration } from 'astro';
import type { MiddlewareRequest, MiddlewareHandler } from './types/middleware';
import { getZeroClient } from './lib/Z.astro';

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
		const handler: MiddlewareHandler = async (req: Request, _: unknown, next: () => void) => {
		  const request = req as MiddlewareRequest;
		  request.locals = request.locals || {};
		  
		  if (!request.locals.zeroClient) {
			request.locals.zeroClient = await getZeroClient();
		  }
		  
		  next();
		};
        
        server.middlewares.use(handler);
      }
    }
  };
}

export default zeroIntegration;
export type { ZeroLocals } from './types/middleware';
