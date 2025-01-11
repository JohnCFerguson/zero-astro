import { createZeroClient } from '../lib/zero';
import type { ZeroOptions } from '@rocicorp/zero';
import type { Schema } from '../zero-schema';
import { createContext } from 'astro/runtime';

export interface ZeroContextValue {
	zero: any; // Replace 'any' with the actual type of your Zero client
}

export const ZeroContext = createContext<ZeroContextValue>();

export const ZeroProvider = async ({
	zeroOptions,
	schema,
	children
}: {
	zeroOptions: ZeroOptions<Schema>;
	schema: Schema;
	children: any;
}) => {
	const zero = createZeroClient(zeroOptions, schema);

	return { children, value: { zero } };
};
