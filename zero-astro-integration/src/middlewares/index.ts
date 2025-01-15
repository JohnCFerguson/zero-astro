// src/middleware/zeroClient.ts
import type { APIContext } from 'astro';
import { getZeroClient } from '../lib/Z.astro';
import type { ZeroLocals } from '../types/middleware';

export async function createMiddleware(context: APIContext) {
  // Initialize locals
  context.locals = context.locals || {};
  context.locals.authToken = '...';
  
  // Initialize Zero client
  const zeroClient = await getZeroClient();
  context.locals.zeroClient = zeroClient;
}

export type { ZeroLocals };