import type { Todo } from '../types.ts';
import { z } from './db.ts';

export const mutations = {
	createTodo: async (todo: Omit<Todo, 'id'>) => {
		const id = crypto.randomUUID();
		await z.write('todo').insert({
			id,
			...todo
		});
		return id;
	},

	updateTodo: async (todo: Todo) => {
		await z.write('todo').update([todo]);
	},

	deleteTodo: async (id: string) => {
		await z.write('todo').delete([id]);
	}
};
