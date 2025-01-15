// src/middleware/zeroClient.ts
import type { APIContext } from 'astro';

export function onRequest(context: APIContext) {
  // ... initialization of zeroClient ...

  // Check if it is an API call
  if (context.request.url.startsWith('/api/login')) {
    // Handle login logic here, setting auth token in context.locals
    context.locals.authToken = '...';
    context.response.headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ status: 'ok' }));
  } 

  context.locals.zeroClient = zeroClient;
}