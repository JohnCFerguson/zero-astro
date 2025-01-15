import { Zero, type Query, type TableSchema, type ZeroOptions } from '@rocicorp/zero';
import type { MakeEntityQueriesFromSchema } from 'node_modules/@rocicorp/zero/out/zero-client/src/client/zero.js';

export type Schema = {
	readonly version: number;
	readonly tables: { readonly [table: string]: TableSchema };
};

export type ZeroConfig = {
	url: string;
	authToken?: string;
	schema?: any;
	userID?: string;
};

export async function getZeroClient(
	config?: ZeroConfig
): Promise<{
	zeroClient: Zero<Schema>;
}> {
	try {
		const zeroUrl = config?.url || import.meta.env.PUBLIC_SERVER;
		const authToken = config?.authToken || import.meta.env.PUBLIC_ZERO_AUTH_TOKEN;
		const userID = config?.userID || import.meta.env.PUBLIC_ZERO_USER_ID || 'default-user';

		if (!zeroUrl) {
			throw new ZeroError('Missing ZERO_URL configuration');
		}

		const zeroClient = new Zero<Schema>({
			server: zeroUrl,
			auth: authToken,
			userID: userID,
			schema: config?.schema,
			logLevel: 'error'
		});

		return { zeroClient };
	} catch (error: unknown) {
		throw new ZeroError(
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
	private _zero: Zero<TSchema>;

	constructor(options: ZeroOptions<TSchema>) {
		super(options);
		this._zero = this.build(options);
	}

	build(z_options: ZeroOptions<TSchema>): Zero<TSchema> {
		return new Zero(z_options);
	}

	get entityQueries(): MakeEntityQueriesFromSchema<TSchema> {
		return this._zero.query;
	}
}

function isKnownTable<TSchema extends Schema>(
	table: string,
	schema: TSchema
): table is keyof TSchema['tables'] {
	return table in schema.tables;
}
