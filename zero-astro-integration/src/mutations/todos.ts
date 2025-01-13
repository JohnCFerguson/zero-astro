import type { WriteTransaction } from '@rocicorp/zero';
import type { Todo, TodoMutation } from '../types/types.js';

export const createTodo: TodoMutation<Todo> = async (tx: WriteTransaction, title: string) => {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false
  };
  await tx.put('todos', todo);
  return todo;
};

export const toggleTodo: TodoMutation<void> = async (tx: WriteTransaction, id: string) => {
  const todo = await tx.get('todos', id);
  if (!todo) throw new Error(`Todo ${id} not found`);
  await tx.put('todos', { ...todo, completed: !todo.completed });
};

export const deleteTodo: TodoMutation<void> = async (tx: WriteTransaction, id: string) => {
  await tx.delete('todos', id);
};

export const mutations = {
  createTodo,
  toggleTodo,
  deleteTodo
};

export type TodoMutations = typeof mutations;
