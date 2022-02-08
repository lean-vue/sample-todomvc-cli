import { describe, expect, test } from 'vitest';
import {
  createTodo,
  deleteTodo,
  getAll,
  updateTodo,
} from './local-persistence';

describe('Local persistence API', () => {
  test('returns initially zero todos', async () => {
    const todos = await getAll();
    expect(todos).toBeInstanceOf(Array);
    expect(todos.length).toBe(0);
  });

  test('can create todos', async () => {
    const t1 = await createTodo('One');
    const t2 = await createTodo('Two');

    expect(t1.id).not.toBe(t2.id);
    expect(t2.title).toBe('Two');
    expect(t2.completed).toBeFalsy();

    const todos = await getAll();
    expect(todos.length).toBe(2);
  });

  test('can update todos', async () => {
    let todos = await getAll();

    const updated1 = await updateTodo(todos[0].id, { title: 'Eins' });
    const updated2 = await updateTodo(todos[1].id, {
      title: 'Zwei',
      completed: true,
    });

    expect(updated1.title).toBe('Eins');
    expect(updated1.completed).toBeFalsy();
    expect(updated2.title).toBe('Zwei');
    expect(updated2.completed).toBeTruthy();

    todos = await getAll();
    expect(todos[1].title).toBe('Zwei');
  });

  test('can delete todos', async () => {
    let todos = await getAll();

    await deleteTodo(todos[1].id);
    todos = await getAll();
    expect(todos.length).toBe(1);

    await deleteTodo(todos[0].id);
    todos = await getAll();
    expect(todos.length).toBe(0);
  });
});
