import type { Todo } from "../types/types.ts";


export const createTodo = async (tx: any, title: string) => {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false
  };
  await tx.put('todos', todo);
  return todo;
};

export const toggleTodo = async (tx: any, id: string) => {
  const todo = await tx.get('todos', id);
  if (!todo) return;
  await tx.put('todos', { ...todo, completed: !todo.completed });
};

export const deleteTodo = async (tx: any, id: string) => {
  await tx.delete('todos', id);
};
