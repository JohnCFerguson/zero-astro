import { Zero, type Schema, type ZeroOptions } from '@rocicorp/zero';
import { Query, type QueryState } from './query.astro';
import type { Expand } from './shared/expand';

export type DataCallback<T> = (data: T) => void;

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

export const isServerEnvironment = () => typeof window === 'undefined';


export class ZeroClient<S extends Schema> extends Zero<Schema> {
  private observers: Map<string, Set<DataCallback<unknown>>> = new Map();
  private targetNode: EventTarget;  
  readonly #query: MakeEntityQueriesFromSchema<S>;

    constructor(config: ZeroOptions<Schema>) {
    super(config);
    const queryObj = Object.entries(this.query).reduce((acc, [key, value]) => {
      const newAcc = {} as Record<keyof S['tables'], Query<S, keyof S['tables']>>;
      newAcc[key as keyof S['tables']] = new Query<S, keyof S['tables']>(value as Query<S, keyof S['tables']>);
      return newAcc;
    }, {} as MakeEntityQueriesFromSchema<S>); // Correct type here
    // Cast this new object.
    this.#query = queryObj;
    this.targetNode = new EventTarget();
  }
  private setupSubscription(table: keyof S["tables"]) {
    if (this.observers.has(table as string)) {
        return;
    }
    this.#query[table].subscribe((state: QueryState<readonly Expand<S["tables"][keyof S["tables"]] & { readonly [x: string]: undefined; }>[]>) => {
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
    this.destroy?.();
  }
}

export async function getZeroClient(config: ZeroConfig<Schema>): Promise<ZeroClient<Schema>> {
  if (!isServerEnvironment() && window.__ZERO_CLIENT__) {
    const client = window.__ZERO_CLIENT__;
    if (!(client instanceof ZeroClient)) {
      throw new ZeroError('Invalid client instance found in window.__ZERO_CLIENT__');
    }
    return client;
  }

    const options: ZeroOptions<Schema> = {
    server: config.publicServer,
    userID: config.userID ?? crypto.randomUUID(),
    schema: config.schema,
    logLevel: config.logLevel ?? 'error',
    kvStore: isServerEnvironment() ? 'mem' : (config.kvStore ?? 'idb'),
  };

  const client = new ZeroClient<Schema>(options);
  if (!isServerEnvironment()) {
    window.__ZERO_CLIENT__ = client;
  }
    return client;
}
declare global {
  interface Window {
    __ZERO_CLIENT__?: ZeroClient<Schema>;
  }
}