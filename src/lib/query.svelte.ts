import type { Query as QueryParam, QueryImpl, QueryType, Smash, TableSchema } from '@rocicorp/zero';

export class Query<TSchema extends TableSchema, TReturn extends QueryType> {
	#queryImpl: QueryImpl<TSchema, TReturn>;
	data: Smash<TReturn>;

	constructor(q: QueryParam<TSchema, TReturn>, enable: boolean = true) {
		this.#queryImpl = q as unknown as QueryImpl<TSchema, TReturn>;
		this.data = $state((this.#queryImpl.singular ? undefined : []) as unknown as Smash<TReturn>);
		$effect(() => {
			if (enable) {
				const view = this.#queryImpl.materialize();
				const unsubscribe = view.addListener((snap) => {
					this.data = (snap === undefined ? snap : $state.snapshot(snap)) as Smash<TReturn>;
				});
				view.hydrate();
				return () => {
					unsubscribe();
					view.destroy();
				};
			}
			this.data = (this.#queryImpl.singular ? undefined : []) as unknown as Smash<TReturn>;
			return () => {};
		});
	}
}
