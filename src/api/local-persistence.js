// LocalStorage helper methods
const loadTodos = () => JSON.parse(localStorage.todos || '[]');
const saveTodos = (todos) => (localStorage.todos = JSON.stringify(todos));
const generateId = () => {
  const nextId = JSON.parse(localStorage.lastId || '0') + 1;
  localStorage.lastId = nextId;
  return nextId;
};

// Persistence API
const getAll = async () => {
  return loadTodos();
};
const createTodo = async (title) => {
  const todo = { id: generateId(), title, completed: false };
  saveTodos([...loadTodos(), todo]);
  return todo;
};
const updateTodo = async (id, changes) => {
  const todos = loadTodos();
  const todoToUpdate = todos.find((t) => t.id === id);
  const updatedTodo = { ...todoToUpdate, ...changes };
  saveTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
  return updatedTodo;
};
const deleteTodo = async (id) => {
  saveTodos(loadTodos().filter((t) => t.id !== id));
};

// Exporting API
export { getAll, createTodo, updateTodo, deleteTodo };
