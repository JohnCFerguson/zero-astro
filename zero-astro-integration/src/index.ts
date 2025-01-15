import type { AstroIntegration } from 'astro';

export { Z, getZeroClient, type Schema } from './lib/Z.astro';
export type { QueryState, QueryOptions } from './types/query';

export default function createZeroIntegration(): AstroIntegration {
	return {
		name: 'zero-astro',
		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({
					vite: {
						plugins: []
					}
				});
			}
		}
	};
}
