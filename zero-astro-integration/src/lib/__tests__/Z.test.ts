import { describe, it, expect } from 'vitest';
import { Z } from '../Z.astro';

describe('Z', () => {
  it('initializes correctly', () => {
    const z = new Z({
      server: 'test',
      userID: 'test',
      schema: { version: 1, tables: {} }
    });
    expect(z.current).toBeDefined();
  });
});
