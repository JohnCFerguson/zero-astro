import type { APIContext, AstroConfig, AstroIntegration } from 'astro';
import { getZeroClient } from './lib/ZeroClient.astro';
import { schema } from './zero-schema';

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
        } as AstroConfig);
      },
      
      'astro:server:setup': async ({ server }) => {
        const zeroClient = await getZeroClient({
          url: import.meta.env.PUBLIC_SERVER,
          schema: {
            version: 1,
            tables: schema.tables
          }
        });

        function adaptAstroRequst(req: APIContext): IncomingMessage {
          const adaptedReq: IncomingMessage = {
            method: req.request.method,
            url: req.request.url,
            headers: req.request.headers,
            body: req.request.body
          };
        }
    

        server.middlewares.use(async (req: APIContext, _res: any, next: () => void) => {
          // Inject the client into Astro's global
          (req.locals as any).zeroClient = zeroClient; 
          next(); 
        });
      }
    }
  };
}

export default zeroIntegration;
export * from './lib/ZeroClient.astro';
