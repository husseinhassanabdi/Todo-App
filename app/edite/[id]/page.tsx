import Link from "next/link";
import { notFound } from "next/navigation";
import { updateTodoAction } from "@/app/actions/update";
import { TodoForm } from "@/app/components/TodoForm";
import { getTodo } from "@/app/lib/todo";

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const todo = await getTodo(id);
  if (!todo) {
    notFound();
  }

  return (
    <main className="app-shell form-shell">
      <header className="app-header form-header">
        <Link className="back-link" href="/">
          ← Back to todos
        </Link>
      </header>
      <section className="form-panel">
        <p className="eyebrow">MAKE IT YOUR OWN</p>
        <h1>Edit todo</h1>
        <p className="form-intro">Update the details or change its priority.</p>
        <TodoForm action={updateTodoAction} todo={todo} />
      </section>
    </main>
  );
}
