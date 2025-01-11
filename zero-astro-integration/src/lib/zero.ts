import { Zero } from '@rocicorp/zero';
import type { ZeroOptions } from '@rocicorp/zero';
import type { Schema } from './Z.astro.ts';

export const createZeroClient = <T extends Schema>(
	serverUrl: string,
	userID: string,
	schema: T,
	options: Omit<ZeroOptions<T>, 'server' | 'schema' | 'userID'> = {}
): Zero<T> => {
	const zeroOptions: ZeroOptions<T> = {
		...options,
		server: serverUrl,
		schema,
		userID
	};

	return new Zero<T>(zeroOptions);
};

export const initZero = <T extends Schema>(options: {
	zeroOptions: { auth: string; serverUrl: string; userID: string; schema: string };
	schema: T;
}) => {
	const { serverUrl, auth, userID, schema: zeroSchema } = options.zeroOptions;
	const { schema } = options;

	return {
		zero: createZeroClient(serverUrl, userID, schema, { auth }),
		schema: zeroSchema as unknown as T, // make sure types align correctly - adjust if necessary
		userID
	};
};
