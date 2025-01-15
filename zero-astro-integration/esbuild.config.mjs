// esbuild.config.js
import { build } from 'esbuild';

build({
	entryPoints: ['src/lib/index.ts'], // Your entry point for the library. Adjust to match.
	outdir: 'dist', // Output directory for bundled files
	bundle: true,
	minify: true, // Minify for production. Set to false for development
	format: 'esm', // Or 'cjs' if you need CommonJS modules. You can also generate both.
	platform: 'node', // Or 'browser' depending on the target environment
	external: ['astro'] // Important: Externalize dependencies that you don't want to bundle
}).catch(() => process.exit(1));
