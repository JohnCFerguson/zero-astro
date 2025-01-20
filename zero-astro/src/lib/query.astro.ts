import type { 
  Query as QueryDef,
  Smash, 
  TypedView as BaseTypedView, 
  Schema 
} from '@rocicorp/zero';
import type { Immutable } from './shared/immutable';

// Type definitions
export type ResultType = 'unknown' | 'complete';
export type Listener<T> = (data: Immutable<T>, resultType: ResultType) => void;
export type QueryResultDetails = Readonly<{
    type: ResultType;
}>;
export interface QueryState<T> {
  data: T | undefined;
  details: { type: ResultType };
}

type TableQueryType<T> = {
  row: T;
  related: Record<string, never>;
  singular: false;
};

// QueryView implementation
class QueryView<T> implements BaseTypedView<T> {
  private baseView: BaseTypedView<T>;
  private listeners: Set<Listener<T>> = new Set();
  data: T;
  
  constructor(view: BaseTypedView<T>) {
    this.baseView = view;
    this.data = view.data;
  }

  addListener(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    
    if (this.data !== undefined) {
      listener(this.data as Immutable<T>, "complete");
    }
  
    const viewUnsubscribe = this.baseView.addListener((data) => {
      listener(data as Immutable<T>, "unknown");
    });

    return () => {
      this.listeners.delete(listener);
      viewUnsubscribe();
    };
  }

  destroy(): void {
    this.listeners.clear();
    this.baseView.destroy();
  }

  subscribe(cb: (data: T) => void): () => void {
    return this.baseView.addListener((data) => cb(data as T));
  }

  onChange(cb: (data: T) => void): () => void {
    return this.baseView.addListener((data) => cb(data as T));
  }
  
}

export class Query<S extends Schema, T extends keyof S['tables']> implements QueryDef<S['tables'][T], TableQueryType<S['tables'][T]>> {
  #baseQuery: QueryDef<S['tables'][T], TableQueryType<S['tables'][T]>>;
  #view: BaseTypedView<Smash<TableQueryType<S['tables'][T]>>> | null = null;
  
  // Method declarations
  where!: QueryDef<S['tables'][T], TableQueryType<S['tables'][T]>>['where'];
  whereExists!: QueryDef<S['tables'][T], TableQueryType<S['tables'][T]>>['whereExists'];
  start!: QueryDef<S['tables'][T], TableQueryType<S['tables'][T]>>['start'];
  limit!: QueryDef<S['tables'][T], TableQueryType<S['tables'][T]>>['limit'];
  orderBy!: QueryDef<S['tables'][T], TableQueryType<S['tables'][T]>>['orderBy'];
  materialize!: QueryDef<S['tables'][T], TableQueryType<S['tables'][T]>>['materialize'];
  
  constructor(queryDef: QueryDef<S['tables'][T], TableQueryType<S['tables'][T]>>) {
    this.#baseQuery = queryDef;
    
    // Bind methods
    this.where = this.#baseQuery.where.bind(this.#baseQuery);
    this.whereExists = this.#baseQuery.whereExists.bind(this.#baseQuery);
    this.start = this.#baseQuery.start.bind(this.#baseQuery);
    this.limit = this.#baseQuery.limit.bind(this.#baseQuery);
    this.orderBy = this.#baseQuery.orderBy.bind(this.#baseQuery);
    this.materialize = this.#baseQuery.materialize.bind(this.#baseQuery);
  }

  one() { return this.#baseQuery.one(); }
  run() { return this.#baseQuery.run(); }
  preload() { return this.#baseQuery.preload(); }
  get related() { return this.#baseQuery.related; }

  subscribe(callback: (state: QueryState<Smash<TableQueryType<S['tables'][T]>>>) => void) {
    if (!this.#view) {
      const view = this.#baseQuery.materialize();
      view.addListener((data, resultType) => {
        callback({
          data: data as Smash<TableQueryType<S['tables'][T]>>,
          details: { type: resultType }
        });
      });
      this.#view = view;
    }
    
    return () => {
      this.#view?.destroy();
      this.#view = null;
    };
  }
}