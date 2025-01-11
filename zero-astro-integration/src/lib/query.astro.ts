import type {
	Query as QueryDef,
	QueryType,
	ReadonlyJSONValue,
	Smash,
	TableSchema,
	TypedView
} from '@rocicorp/zero';
import { deepClone } from './shared/deep-clone.ts';
import type { Z } from './Z.astro.ts';

export type ResultType = 'loading' | 'partial' | 'complete' | 'error';

export type QueryResultDetails = {
	type: ResultType;
	error?: Error;
};

export type QueryResult<TReturn extends QueryType> = {
	data: Smash<TReturn> | undefined;
	details: QueryResultDetails;
};

export class Query<TSchema extends TableSchema, TReturn extends QueryType> {
	private zero: Z;
	private query: QueryDef<TSchema, TReturn>;
	private view: TypedView<Smash<TReturn>> | undefined;
	private data: Smash<TReturn> | undefined;
	private details: QueryResultDetails;
	private listeners: (() => void)[] = [];

	constructor(zero: Z, query: QueryDef<TSchema, TReturn>, options?: unknown) {
		this.zero = zero;
		this.query = query;
		this.data = query.format.singular ? undefined : ([] as unknown as Smash<TReturn>);
		this.details = { type: 'loading' };
		this.initialize();
	}

	private async initialize() {
		try {
			const advancedQuery = this.query as unknown as AdvancedQuery<
				TSchema,
				TReturn,
				unknown,
				unknown
			>; // Type cast to access advanced properties
			this.view = await this.zero.query(advancedQuery);

			this.view.addListener((snap, resultType) => {
				this.data =
					snap === undefined
						? undefined
						: (deepClone(snap as ReadonlyJSONValue) as Smash<TReturn>);
				this.details = { type: resultType };
				this.notifyListeners();
			});

			this.details = { type: this.view.resultType };
			this.notifyListeners();
		} catch (error) {
			this.details = { type: 'error', error: error as Error };
			this.notifyListeners();
		}
	}

	public addListener(listener: () => void): void {
		this.listeners.push(listener);
	}

	public removeListener(listener: () => void): void {
		this.listeners = this.listeners.filter((l) => l !== listener);
	}

	private notifyListeners(): void {
		this.listeners.forEach((listener) => listener());
	}

	public get current(): QueryResult<TReturn> {
		return { data: this.data, details: this.details };
	}

	public destroy(): void {
		this.view?.destroy();
		this.view = undefined;
	}
}
