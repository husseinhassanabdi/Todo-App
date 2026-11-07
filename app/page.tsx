import Link from "next/link";
import { searchTodosAction } from "@/app/actions/search";
import { TodoList } from "@/app/components/TodoList";
import { listTodos } from "@/app/lib/todo";
import type { TodoStatus } from "@/app/types/todo";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

const statuses: { value: TodoStatus; label: string }[] = [
  { value: "all", label: "All todos" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const status: TodoStatus =
    params.status === "active" || params.status === "completed"
      ? params.status
      : "all";
  const todos = await listTodos({ query, status });

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">
          ✓
        </div>
        <div>
          <p className="eyebrow">YOUR SPACE, IN ORDER</p>
          <h1>Todo List</h1>
        </div>
        <Link className="button button-primary add-button" href="/new">
          <span aria-hidden="true">+</span> New todo
        </Link>
      </header>

      <section className="list-panel">
        <div className="panel-heading">
          <div>
            <h2>All the things</h2>
            <p>One step at a time.</p>
          </div>
          <span className="todo-count">
            {todos.length} {todos.length === 1 ? "todo" : "todos"}
          </span>
        </div>

        <form action={searchTodosAction} className="search-form">
          <label className="visually-hidden" htmlFor="query">
            Search todos
          </label>
          <input
            defaultValue={query}
            id="query"
            name="query"
            placeholder="Search your todos..."
            type="search"
          />
          <label className="visually-hidden" htmlFor="status">
            Filter by completion
          </label>
          <select defaultValue={status} id="status" name="status">
            {statuses.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="button button-secondary" type="submit">
            Search
          </button>
        </form>

        <TodoList todos={todos} />
      </section>
      <footer className="app-footer">A little progress adds up.</footer>
    </main>
  );
}
