/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    locals: {
      zeroClient: Promise<{ 
        zeroClient: ZeroClient<Schema> 
      }>;
    };
  }
}

interface ImportMetaEnv {
	readonly PUBLIC_SERVER: string;
	readonly PUBLIC_ZERO_AUTH_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
