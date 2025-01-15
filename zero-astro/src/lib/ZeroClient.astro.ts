import { Zero, type TableSchema, type ZeroOptions } from '@rocicorp/zero';


export type Schema = {
	readonly version: number;
	readonly tables: { readonly [table: string]: TableSchema };
};

export type ZeroConfig = {
	url: string | URL;
	schema: Schema;
	authToken?: string;
	userID?: string;
};

export async function getZeroClient(
	config: ZeroConfig
): Promise<{
	zeroClient: ZeroClient<Schema>;
}> {
	try {
		const zeroUrl = config.url instanceof URL ? config.url.toString() : config.url || import.meta.env.PUBLIC_SERVER;
		const authToken = config.authToken || import.meta.env.PUBLIC_ZERO_AUTH_TOKEN;
		const userID = config.userID || import.meta.env.PUBLIC_ZERO_USER_ID || 'default-user';

		if (!zeroUrl) {
			throw new ZeroError('Missing ZERO_URL configuration');
		}

		const zeroClient = new ZeroClient({
			server: zeroUrl,
			auth: authToken,
			userID: userID,
			schema: config.schema,
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

	constructor(options: ZeroOptions<TSchema>) {
		super(options);
	}
}
