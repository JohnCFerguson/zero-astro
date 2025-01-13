import { Zero } from '@rocicorp/zero';
import type { Schema } from './Z.astro';

declare global {
  interface Window {
    __ZERO_CLIENT__: Zero<Schema>;
  }
}

export function getZeroClient(): Zero<Schema> {
  if (typeof window === 'undefined') {
    throw new Error('getZeroClient must be called in browser context');
  }
  
  const client = window.__ZERO_CLIENT__;
  if (!client) {
    throw new Error('No Zero client found - did you include ZeroProvider?');
  }
  
  return client;
}
