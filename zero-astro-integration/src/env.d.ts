/// <reference types="astro/client" />
import type { ZeroLocals } from './src/types/middleware';

interface ImportMetaEnv {
	readonly PUBLIC_SERVER: string;
	readonly PUBLIC_ZERO_AUTH_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module 'astro' {
  interface APIContext {
    locals: ZeroLocals;
  }
}
