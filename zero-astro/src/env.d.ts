/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    zeroConfig: ZeroConfig<Schema>
    zeroInitScript: string;
  };
  
}


interface ImportMetaEnv {
	readonly PUBLIC_SERVER: string;
	readonly PUBLIC_ZERO_AUTH_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
