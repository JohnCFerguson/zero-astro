import type { QueryType, Smash } from '@rocicorp/zero';

export interface QueryOptions {
  /** Enable/disable automatic revalidation */
  revalidate?: boolean;
  /** Custom error handler */
  onError?: (error: Error) => void;
  /** Callback when data is successfully fetched */
  onSuccess?: (data: any) => void;
  cache?: boolean;
  cacheTime?: number;
  suspense?: boolean;
  initialState?: QueryState<unknown>;
  pollInterval?: number;
}

export type QueryState<T> = {
  data: T | undefined;
  details: QueryResultDetails;
};

export type ResultType = 'unknown' | 'loading' | 'error' | 'complete';

export type QueryResultDetails = {
	type: ResultType;
};

export type QueryResult<TReturn extends QueryType> = [Smash<TReturn>, QueryResultDetails];


export interface QueryCache<T> {
  state: QueryState<T>;
  subscribers: Set<() => void>;
}

export interface QuerySubscriber<T> {
  subscribe: (callback: (state: QueryState<T>) => void) => () => void;
}
