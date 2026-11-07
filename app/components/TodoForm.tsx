"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ActionState } from "@/app/lib/action-state";
import { priorities, type Todo } from "@/app/types/todo";

type TodoFormAction = (
  previousState: ActionState,
  formData: FormData,
) => Promise<ActionState>;

export function TodoForm({
  action,
  todo,
}: {
  action: TodoFormAction;
  todo?: Todo;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="todo-form">
      {todo && <input type="hidden" name="id" value={todo.id} />}

      <label htmlFor="title">Title</label>
      <input
        autoFocus
        defaultValue={todo?.title ?? ""}
        id="title"
        maxLength={120}
        name="title"
        placeholder="What needs to get done?"
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        defaultValue={todo?.description ?? ""}
        id="description"
        maxLength={1000}
        name="description"
        placeholder="Add a few details (optional)"
        rows={4}
      />

      <label htmlFor="priority">Priority</label>
      <select
        defaultValue={todo?.priority ?? "medium"}
        id="priority"
        name="priority"
      >
        {priorities.map((priority) => (
          <option key={priority} value={priority}>
            {priority[0].toUpperCase() + priority.slice(1)}
          </option>
        ))}
      </select>

      {state.error && (
        <p aria-live="polite" className="form-message form-error">
          {state.error}
        </p>
      )}
      <div className="form-actions">
        <button className="button button-primary" disabled={pending} type="submit">
          {pending ? "Saving..." : todo ? "Save changes" : "Create todo"}
        </button>
        <Link className="button button-secondary" href="/">
          Cancel
        </Link>
      </div>
    </form>
  );
}
