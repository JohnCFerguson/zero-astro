import type { IncomingMessage, ServerResponse } from 'http';
import type { Connect } from 'vite';
import type { getZeroClient } from '../lib/Z.astro';

export interface ZeroLocals {
  zeroClient?: ReturnType<typeof getZeroClient>;
  authToken?: string;
}

export type MiddlewareRequest = IncomingMessage & {
  locals?: ZeroLocals;
};

export type MiddlewareHandler = Connect.NextHandleFunction;