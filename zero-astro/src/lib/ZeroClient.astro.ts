import { Zero, type Schema, type ZeroOptions } from '@rocicorp/zero';

export interface ZeroConfig<S extends Schema> {
    // Required configurations
    userID: string;
    schema: S;
    server: string;

    // Optional configurations
    auth?: string | ((error?: 'invalid-token') => Promise<string | undefined>);
    storageKey?: string;
    logLevel?: 'debug' | 'info' | 'error';
    kvStore?: 'mem' | 'idb';
}

export async function getZeroClient<S extends Schema>(
    config: ZeroConfig<S>
): Promise<Zero<S>> {
    try {
        const options: ZeroOptions<S> = {
            server: config.server,
            userID: config.userID,
            schema: config.schema,
            auth: config.auth,
            storageKey: config.storageKey,
            logLevel: config.logLevel ?? 'error',
            kvStore: config.kvStore,
        };

        return new Zero(options);
    } catch (error: unknown) {
        throw new Error(
            `Failed to initialize Zero client: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

export class ZeroError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ZeroError';
	}
}

export class ZeroClient<TSchema extends Schema> extends Zero<TSchema> {

	constructor(options: ZeroOptions<TSchema>) {
		super(options);
	}
}
