// esbuild.config.js
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/index.js',
  external: [
    'astro',
    '@rocicorp/zero'
  ],
  platform: 'neutral',
  target: 'ESNext',
  sourcemap: true
});
