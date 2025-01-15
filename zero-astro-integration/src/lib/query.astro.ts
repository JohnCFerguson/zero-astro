import type { APIContext } from 'astro';
import { getZeroClient } from './Z.astro';
import type { Query as QueryDef, QueryType, Smash, TableSchema, TypedView } from '@rocicorp/zero';
import type { QueryResultDetails } from '../types/query.ts';
import type { AdvancedQuery } from '@rocicorp/zero/advanced';

interface QueryState<T> {
	data: T | undefined;
	details: QueryResultDetails;
}

export class Query<TSchema extends TableSchema, TReturn extends QueryType> {
	private queryDef: QueryDef<TSchema, TReturn>;
	private data: Smash<TReturn> | undefined;
	private details: QueryResultDetails;
	private listeners: Set<(state: QueryState<Smash<TReturn>>) => void> = new Set();
	private view: TypedView<Smash<TReturn>> | undefined;

	constructor({ locals }: APIContext, queryDef: QueryDef<TSchema, TReturn>) {
		this.queryDef = queryDef;
		this.data = undefined;
		this.details = { type: 'loading' };
		this.initialize(locals as APIContext);
	}

	private async initialize({ locals }: APIContext) {
		try {
			const zero = await getZeroClient({ locals } as APIContext);
			this.view = await zero.view(this.queryDef);
			this.view.onData((data) => this.handleChange(data));
		} catch (error) {
			this.details = { type: 'error', error: error as Error };
			this.notifyListeners();
		}
	}

	private handleChange(data: Smash<TReturn>) {
		this.data = data;
		this.details = { type: 'complete' };
		this.notifyListeners();
	}

	private notifyListeners() {
		const state = this.current;
		this.listeners.forEach((listener) => listener(state));
	}

	subscribe(callback: (state: QueryState<Smash<TReturn>>) => void): () => void {
		this.listeners.add(callback);
		callback(this.current);
		return () => {
			this.listeners.delete(callback);
			if (this.listeners.size === 0) {
				this.close();
			}
		};
	}

	private close() {
		if (this.view) {
			this.view.close();
			this.view = undefined;
		}
	}

	get current(): QueryState<Smash<TReturn>> {
		return {
			data: this.data,
			details: this.details
		};
	}
}

interface TableView<T> {
	current: T[] | undefined;
	onData: (callback: (data: T[]) => void) => void;
	close: () => void;
}

export class ViewStore {
	private views: Map<string, ViewWrapper<any, any>> = new Map();

	getView<TSchema extends TableSchema, TReturn extends QueryType>(
		clientID: string,
		query: AdvancedQuery<TSchema, TReturn>,
		enabled: boolean = true
	): ViewWrapper<TSchema, TReturn> {
		if (!enabled) {
			return new ViewWrapper(
				query,
				() => {},
				() => {}
			);
		}
		const key = JSON.stringify(query);
		let view = this.views.get(key) as ViewWrapper<TSchema, TReturn>;

		if (!view) {
			view = new ViewWrapper(
				query,
				() => {},
				() => {}
			);
			this.views.set(key, view);
		}

		return view;
	}

	close() {
		this.views.forEach((view) => view.close());
		this.views.clear();
	}
}

export class ViewWrapper<TSchema extends TableSchema, TReturn extends QueryType> {
	private view: TypedView<Smash<TReturn>> | undefined;
	private query: QueryDef<TSchema, TReturn>;
	private onMaterialized: (view: ViewWrapper<TSchema, TReturn>) => void;
	private onDematerialized: () => void;
	private listeners: Set<(data: Smash<TReturn>) => void> = new Set();

	constructor(
		query: QueryDef<TSchema, TReturn>,
		onMaterialized: (view: ViewWrapper<TSchema, TReturn>) => void,
		onDematerialized: () => void
	) {
		this.query = query;
		this.onMaterialized = onMaterialized;
		this.onDematerialized = onDematerialized;
	}

	async subscribe(
		{ locals }: APIContext,
		callback: (data: Smash<TReturn>) => void
	): Promise<() => void> {
		if (!this.view) {
			const zero = await getZeroClient({ locals } as APIContext);
			this.view = await zero.view(this.query);
			this.view.onData((data) => {
				this.listeners.forEach((listener) => listener(data));
			});
		}

		this.listeners.add(callback);
		return () => {
			this.listeners.delete(callback);
			if (this.listeners.size === 0) {
				this.close();
			}
		};
	}

	close() {
		if (this.view) {
			this.view.close();
			this.view = undefined;
		}
	}

	get current(): QueryState<Smash<TReturn>> {
		return {
			data: this.view?.current,
			details: {
				type: this.view ? 'complete' : 'loading'
			}
		};
	}
}

export const viewStore = new ViewStore();
