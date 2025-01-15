// Utility Types
export type MaybePromise<T> = T | Promise<T>;

export type Primitive = undefined | null | boolean | string | number | symbol | bigint;

export type Writable<T> = {
	-readonly [P in keyof T]: T[P];
};

export type Immutable<T> = T extends Primitive
	? T
	: T extends Array<infer U>
		? ReadonlyArray<Immutable<U>>
		: { readonly [K in keyof T]: Immutable<T[K]> };

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;