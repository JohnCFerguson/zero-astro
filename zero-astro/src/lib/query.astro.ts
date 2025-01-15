import type { Query as QueryDef, QueryType, Smash, TableSchema, TypedView } from '@rocicorp/zero';
import type { AdvancedQuery } from '@rocicorp/zero/advanced';
import type { QueryResultDetails, QueryState } from '~/types/query.js';

export class Query<TSchema extends TableSchema, TReturn extends QueryType> {
	private queryDef: QueryDef<TSchema, TReturn>;
	private data: Smash<TReturn> | undefined;
	private details: QueryResultDetails;
	private listeners: Set<(state: QueryState<Smash<TReturn>>) => void> = new Set();
	private unsubscribe?: () => void;

	constructor(queryDef: QueryDef<TSchema, TReturn>) {
		this.queryDef = queryDef;
		this.data = undefined;
		this.details = { type: 'loading' };
		this.initialize();
	}

	private async initialize() {
		try {
			const view = this.queryDef.materialize();
			this.unsubscribe = () => view.destroy();
			
			// Set up data subscription
			if (view.data) {
				this.handleChange(view.data);
			}
		} catch (error) {
			this.details = { 
				type: 'error',
				errorMessage: error instanceof Error ? error.message : 'Unknown error'
			};
			this.notifyListeners();
		}
	}

	private handleChange(data: Smash<TReturn>) {
		this.data = data;
		this.details = { type: 'success' };
		this.notifyListeners();
	}

	subscribe(callback: (state: QueryState<Smash<TReturn>>) => void) {
		this.listeners.add(callback);
		callback({ data: this.data, details: this.details });
		return () => {
			this.listeners.delete(callback);
		};
	}

	private notifyListeners() {
		const state = { data: this.data, details: this.details };
		this.listeners.forEach((listener) => listener(state));
	}

	dispose() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
		this.listeners.clear();
	}
}

export class ViewStore {
	private views: Map<string, ViewWrapper<TableSchema, QueryType>> = new Map();

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
		callback: (data: Smash<TReturn>) => void
	): Promise<() => void> {
		if (!this.view) {
			const view = this.query.materialize();
			this.view = view;
			this.onMaterialized(this);

			// Initial data
			if (this.view.data) {
				callback(this.view.data);
			}
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
		this.view?.destroy();
	}

	get current(): QueryState<Smash<TReturn>> {
		return {
			data: this.view?.data,
			details: {
				type: this.view ? 'success' : 'loading'
			}
		};
	}}

export const viewStore = new ViewStore();
