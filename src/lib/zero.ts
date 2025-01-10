import { Zero } from '@rocicorp/zero';
import type { Schema } from '../types';

export const initZero = <T extends Schema>(options: { zeroOptions: { auth: string } }) => {
  return new Zero<T>({
    name: `my-zero-db`,
    auth: options.zeroOptions.auth,
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
};
