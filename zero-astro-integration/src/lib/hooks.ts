import type { TableSchema, QueryType } from '@rocicorp/zero';
import type { ZeroQuery } from './query.astro';

export type QueryState<T> = {
  data: T | null;
  details: {
    type: 'loading' | 'complete' | 'error' | 'partial';
    error?: Error;
  };
};

export function createSubscriber<TSchema extends TableSchema, TReturn extends QueryType>(
  query: ZeroQuery<TSchema, TReturn>
) {
  return {
    subscribe: (callback: (state: QueryState<TReturn>) => void) => {
      const unsubscribe = query.current.subscribe((state) => {
        callback(state);
      });
      return unsubscribe;
    }
  };
}
