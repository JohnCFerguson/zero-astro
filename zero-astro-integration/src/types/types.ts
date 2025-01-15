import type { WriteTransaction } from '@rocicorp/zero';

// JSON Types
export type JSONValue = null | string | boolean | number | JSONValue[] | JSONObject;

export type JSONObject = {
	[key: string]: JSONValue | undefined;
};

// Todo Types
export interface Todo {
	id: string;
	title: string;
	completed: boolean;
}

export type TodoMutation<T> = (tx: WriteTransaction, ...args: any[]) => Promise<T>;

// User Types
export interface User {
	id: number;
	name: string;
	email: string;
}

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
