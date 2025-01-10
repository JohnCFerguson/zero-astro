import type { Todo } from '../types';
import { z } from './db';

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
