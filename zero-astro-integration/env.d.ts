/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_ZERO_URL: string;
  readonly PUBLIC_ZERO_AUTH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}