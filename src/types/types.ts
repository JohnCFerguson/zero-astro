import type { QueryType, Smash, TableSchema } from '@rocicorp/zero'

// JSON Types
export type JSONValue = 
  | null 
  | string
  | boolean
  | number
  | JSONValue[]
  | JSONObject

export type JSONObject = {
  [key: string]: JSONValue | undefined
}

export type ReadonlyJSONValue =
  | null
  | string 
  | boolean
  | number
  | readonly ReadonlyJSONValue[]
  | ReadonlyJSONObject

export type ReadonlyJSONObject = {
  readonly [key: string]: ReadonlyJSONValue | undefined
}

// Database Schema Types
export interface Schema {
  readonly version: number
  readonly tables: { readonly [table: string]: TableSchema }
}

// Todo Types
export interface Todo {
  id: string
  title: string
  completed: boolean
}

// User Types 
export interface User {
  id: number
  name: string
  email: string
}

// Utility Types
export type MaybePromise<T> = T | Promise<T>

export type Primitive = undefined | null | boolean | string | number | symbol | bigint

export type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type Immutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<Immutable<U>>
  : { readonly [K in keyof T]: Immutable<T[K]> }

export type Expand<T> = T extends infer O ? {[K in keyof O]: O[K]} : never

export type ResultType = 'unknown' | 'complete';

export type QueryResultDetails = {
    type: ResultType;
};

export type QueryResult<TReturn extends QueryType> = [Smash<TReturn>, QueryResultDetails];
