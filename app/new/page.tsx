import Link from "next/link";
import { createTodoAction } from "@/app/actions/create";
import { TodoForm } from "@/app/components/TodoForm";

export default function NewTodoPage() {
  return (
    <main className="app-shell form-shell">
      <header className="app-header form-header">
        <Link className="back-link" href="/">
          ← Back to todos
        </Link>
      </header>
      <section className="form-panel">
        <p className="eyebrow">MAKE A LITTLE PROGRESS</p>
        <h1>Create a todo</h1>
        <p className="form-intro">Capture what you want to get done next.</p>
        <TodoForm action={createTodoAction} />
      </section>
    </main>
  );
}
