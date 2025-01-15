// astro.config.mjs
// @ts-check
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			PUBLIC_SERVER: envField.string({ context: 'server', access: 'secret', optional: false }),
			ZERO_UPSTREAM_DB: envField.string({ context: 'server', access: 'secret', optional: false }),
			ZERO_CVR_DB: envField.string({ context: 'server', access: 'secret', optional: false }),
			ZERO_CHANGE_DB: envField.string({ context: 'server', access: 'secret', optional: false }),
			ZERO_AUTH_SECRET: envField.string({ context: 'server', access: 'secret', optional: false }),
			ZERO_REPLICA_FILE: envField.string({ context: 'server', access: 'secret', optional: false })
		}
	},
	integrations: [typescript()],
	vite: {
		optimizeDeps: {
			include: ['@rocicorp/zero']
		},
		ssr: {
			noExternal: ['@rocicorp/zero']
		}
	}
});
