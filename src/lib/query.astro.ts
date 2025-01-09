import { createSubscriber } from 'svelte/reactivity';
import type {
	Query as QueryDef,
	QueryType,
	ReadonlyJSONValue,
	Smash,
	TableSchema,
	TypedView
} from '@rocicorp/zero';
import { deepClone } from './shared/deep-clone.ts';
import type { Immutable } from './shared/immutable.ts';
import type { AdvancedQuery } from '@rocicorp/zero/advanced';
import { getContext } from 'svelte';
import type { Schema, Z } from './Z.astro.ts';

export type ResultType = 'unknown' | 'complete';

export type QueryResultDetails = {
    type: ResultType;
};

export type QueryResult<TReturn extends QueryType> = {
    data: Smash<TReturn>;
    details: QueryResultDetails;
};

export class Query<TSchema extends TableSchema, TReturn extends QueryType> {
    #view: TypedView<Smash<TReturn>> | undefined;
    #data: Smash<TReturn>;
    #details: QueryResultDetails;

    constructor(query: QueryDef<TSchema, TReturn>) {
        const defaultData = query.format.singular ? undefined : [] as unknown as Smash<TReturn>;
        this.#data = defaultData;
        this.#details = { type: 'unknown' };
        this.#initialize(query);
    }

    private async #initialize(query: QueryDef<TSchema, TReturn>) {
        this.#view = query.materialize();
        this.#view.addListener((snap, resultType) => {
            const data = snap === undefined ? 
                snap : 
                (deepClone(snap as ReadonlyJSONValue) as Smash<TReturn>);
            this.#data = data;
            this.#details = { type: resultType };
        });
    }

    get current(): QueryResult<TReturn> {
        return {
            data: this.#data,
            details: this.#details
        };
    }

    destroy() {
        this.#view?.destroy();
        this.#view = undefined;
    }
}
