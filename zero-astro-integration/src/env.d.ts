/// <reference types="astro/client" />

import type { ZeroClient, Schema } from './src/lib/Z.astro';

interface ImportMetaEnv {
	readonly PUBLIC_SERVER: string;
	readonly PUBLIC_ZERO_AUTH_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module 'astro' {
	interface Locals {
		zeroClient: ZeroClient;
	}
}
