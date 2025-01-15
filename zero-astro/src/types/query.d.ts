//  Query Types
import type { QueryType, Smash } from '@rocicorp/zero';

export interface QueryOptions<T = unknown> {
  /** Enable/disable automatic revalidation */
  revalidate?: boolean;
  /** Custom error handler */
  onError?: (error: Error) => void;
  /** Callback when data is successfully fetched */
  onSuccess?: (data: T) => void;
  cache?: boolean;
  cacheTime?: number;
  suspense?: boolean;
  initialState?: QueryState<T>;
  pollInterval?: number;
}

export type QueryState<T> = {
  data: T | undefined;
  details: QueryResultDetails;
};

export type ResultType = 'loading' | 'success' | 'error';

export interface QueryResultDetails {
	type: ResultType;
	errorMessage?: string;
}

export type QueryResult<TReturn extends QueryType> = [Smash<TReturn>, QueryResultDetails];


export interface QueryCache<T> {
  state: QueryState<T>;
  subscribers: Set<() => void>;
}

export interface QuerySubscriber<T> {
  subscribe: (callback: (state: QueryState<T>) => void) => () => void;
}

