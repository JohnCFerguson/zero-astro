// @ts-check
import { defineConfig } from 'astro/config';
import zeroIntegration from './src/index.ts';

// https://astro.build/config
export default defineConfig({
  integrations: [zeroIntegration()],
  output: 'server',
  vite: {
    optimizeDeps: {
      include: ['@rocicorp/zero']
    },
    ssr: {
      noExternal: ['@rocicorp/zero']
    }
  }});
