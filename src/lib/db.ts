import { Zero } from '@rocicorp/zero';
import type { Schema } from '../types';

const auth = process.env.ZERO_AUTH_TOKEN || 'default-auth-token';

export const z = new Zero<Schema>({
  name: 'zero-astro-db',
  auth,
  version: 1,
  tables: {
    todo: {
      columns: {
        id: { type: 'string' },
        title: { type: 'string' },
        completed: { type: 'boolean' },
      },
    },
    user: {
      columns: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
    },
  },
});
