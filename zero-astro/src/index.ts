import type { AstroIntegration } from 'astro';

export interface ZeroAstroConfig {
  projectId?: string;
  environment?: string;
}

export function zeroAstro(config?: ZeroAstroConfig): AstroIntegration {
  return {
    name: 'zero-astro',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        const projectId = config?.projectId || process.env.ZERO_PROJECT_ID;
        const environment = config?.environment || process.env.ZERO_ENVIRONMENT || 'development';

        if (!projectId) {
          throw new Error('Zero Project ID is required');
        }

        updateConfig({
          vite: {
            define: {
              'process.env.ZERO_PROJECT_ID': JSON.stringify(projectId),
              'process.env.ZERO_ENVIRONMENT': JSON.stringify(environment)
            },
            optimizeDeps: {
              include: ['@rocicorp/zero']
            }
          }
        });
      }
    }
  };
}

// Core exports
export * from './lib/ZeroClient.astro';
export default zeroAstro;