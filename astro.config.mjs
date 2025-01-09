// @ts-check
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      PUBLIC_SERVER: envField.string({ 
        context: 'client',
        required: true 
      }),
      ZERO_UPSTREAM_DB: envField.string({ 
        context: 'server',
        required: true 
      }),
      ZERO_CVR_DB: envField.string({ 
        context: 'server',
        required: true 
      }),
      ZERO_CHANGE_DB: envField.string({ 
        context: 'server',
        required: true 
      }),
      ZERO_AUTH_SECRET: envField.string({
        context: 'server',
        required: true 
      }),
      ZERO_REPLICA_FILE: envField.string({
        context: 'server',
        required: true
      })
    }
  },
  vite: {
    optimizeDeps: {
      include: ['@rocicorp/zero']
    }
  }
});