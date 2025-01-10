import { initZero } from '../lib/zero';
import type { Schema } from '../types';

export const createZeroContext = (auth: string) => {
  const z = initZero<Schema>({
    zeroOptions: {
      auth
    }
  });

  return {
    z,
    destroy: () => z.close()
  };
};
