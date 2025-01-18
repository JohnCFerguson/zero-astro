import { type APIContext, type AstroConfig, type AstroCookies, type AstroIntegration } from 'astro';
import type { Connect } from 'vite';
import { createZeroClientMiddleware } from './middleware';
import type { Schema } from '@rocicorp/zero';

interface ZeroPluginConfig {
  publicServer: string;
  upstreamDb: string;
  cvrDb: string;
  changeDb: string;
  authSecret: string;
  replicaFile: string;
  schema: Schema;
  userID?: string;
}

export function createPlugin(config: ZeroPluginConfig): AstroIntegration {
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
        const zeroClientMiddleware = createZeroClientMiddleware(config);
        
        server.middlewares.use(async (req, res, next: Connect.NextFunction) => {
          const request = new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: new Headers(req.headers as Record<string, string>),
          });

          const context: APIContext = {
            locals: {} as App.Locals,
            request,
            url: new URL(request.url),
            site: undefined,
            generator: '',
            params: {} as Record<string, string | undefined>,
            props: {} as App.Locals,
            redirect: (path: string) => new Response(null, {
              status: 302,
              headers: { Location: path }
            }),
            rewrite: () => Promise.resolve(new Response()),
            preferredLocale: undefined,
            preferredLocaleList: undefined,
            currentLocale: undefined,
            routePattern: '',
            clientAddress: req.socket?.remoteAddress ?? '',
            originPathname: new URL(request.url).pathname,
            getActionResult: () => undefined,
            callAction: async () => { throw new Error('Not implemented'); },
            isPrerendered: false,
            cookies: {} as AstroCookies
          };
          
          try {
            return await zeroClientMiddleware(context, () => {
              next();
              return Promise.resolve(new Response('Successfully set up Zero Client'))
            });
          } catch (e) {
            next(e);
            return new Response(null, { status: 500 });
          }
        });
      }
    }
  };
}

// Core exports
export * from './lib/ZeroClient.astro';
export * from './lib/query.astro';