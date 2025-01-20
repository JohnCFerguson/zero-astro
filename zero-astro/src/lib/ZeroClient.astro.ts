import { Zero, type Schema, type ZeroOptions, type TableSchema, type QueryType } from '@rocicorp/zero';
import { Query } from './query';

type DataCallback<T> = (data: T) => void;

type DefaultQueryResultRow<T extends TableSchema> = {
  row: T;
  related: Record<string, never>;
  singular: false;
};

export type MakeEntityQueriesFromSchema<S extends Schema> = {
    readonly [K in keyof S['tables']]: Query<S, K>;
};

export interface ZeroConfig<S extends Schema> {
  publicServer: string;
  upstreamDb: string;
  cvrDb: string;
  changeDb: string;
  replicaFile: string;
  schema: S;
  kvStore?: 'mem' | 'idb';
  auth?: string;
  logLevel?: 'debug' | 'info' | 'error';
  userID?: string;
}

export class ZeroError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ZeroError';
  }
}

const isServerEnvironment = () => typeof window === 'undefined';

declare global {
  interface Window {
    __ZERO_CLIENT__?: ZeroClient<Schema>;
  }
}

export class ZeroClient<S extends Schema> extends Zero<S> {
  private observers: Map<string, Set<DataCallback<unknown>>> = new Map();
  private targetNode: EventTarget;
  readonly query: MakeEntityQueriesFromSchema<S>;

  constructor(config: ZeroOptions<S>) {
    super(config);
    this.targetNode = new EventTarget();
    this.query = Object.entries(super.query).reduce((acc, [key, value]) => {
      acc[key as keyof S['tables']] = new Query(value);
      return acc;
    }, {} as MakeEntityQueriesFromSchema<S>);
  }

  private setupSubscription(table: keyof S["tables"]) {
    if (this.observers.has(table as string)) {
      return;
    }

    this.query[table].subscribe((state: QueryState) => {
      if (state.details.type === 'complete' && state.data) {
        const observers = this.observers.get(table as string);
        if (observers) {
          observers.forEach(callback => {
            try {
              callback(state.data);
            } catch (error) {
              console.error(`Error in observer callback for table ${String(table)}:`, error);
            }
          });
        }

        const event = new CustomEvent('dataChange', {
          detail: { table, data: state.data }
        });
        this.targetNode.dispatchEvent(event);
      }
    });
  }

  public subscribe<T extends keyof S['tables']>(
    table: T,
    callback: DataCallback<S['tables'][T][]>
  ): () => void {
    if (!this.observers.has(table as string)) {
      this.observers.set(table as string, new Set());
      this.setupSubscription(table);
    }
    
    const observers = this.observers.get(table as string)!;
    observers.add(callback as DataCallback<unknown>);
    
    return () => {
      observers.delete(callback as DataCallback<unknown>);
      if (observers.size === 0) {
        this.observers.delete(table as string);
      }
    };
  }

  public destroy(): void {
    this.observers.clear();
    if (!isServerEnvironment()) {
      window.__ZERO_CLIENT__ = undefined;
    }
    super.destroy?.();
  }
}

export async function getZeroClient<S extends Schema>(config: ZeroConfig<S>): Promise<ZeroClient<S>> {
  if (!isServerEnvironment() && window.__ZERO_CLIENT__) {
    const client = window.__ZERO_CLIENT__;
    if (!(client instanceof ZeroClient)) {
      throw new ZeroError('Invalid client instance found in window.__ZERO_CLIENT__');
    }
    return client as ZeroClient<S>;
  }

  const options: ZeroOptions<S> = {
    server: config.publicServer,
    userID: config.userID ?? 'user',
    schema: config.schema,
    logLevel: config.logLevel ?? 'error',
    kvStore: isServerEnvironment() ? 'mem' : (config.kvStore ?? 'idb'),
  };

  const client = new ZeroClient<S>(options);
  if (!isServerEnvironment()) {
    window.__ZERO_CLIENT__ = client;
  }
  return client;
}