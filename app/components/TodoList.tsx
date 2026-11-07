"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { bulkTodosAction } from "@/app/actions/bulk";
import { deleteTodoAction } from "@/app/actions/delete";
import { toggleTodoAction } from "@/app/actions/toggle";
import type { Todo } from "@/app/types/todo";

function relativeTime(timestamp: string, now: number): string {
  const seconds = Math.round((new Date(timestamp).getTime() - now) / 1000);
  const absoluteSeconds = Math.abs(seconds);
  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (absoluteSeconds < 60) {
    value = seconds;
    unit = "second";
  } else if (absoluteSeconds < 3600) {
    value = Math.round(seconds / 60);
    unit = "minute";
  } else if (absoluteSeconds < 86400) {
    value = Math.round(seconds / 3600);
    unit = "hour";
  } else {
    value = Math.round(seconds / 86400);
    unit = "day";
  }

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(value, unit);
}

export function TodoList({ todos }: { todos: Todo[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [state, formAction, pending] = useActionState(bulkTodosAction, {});
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(Date.now());
    updateTime();
    const intervalId = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (state.message) {
      setSelectedIds([]);
    }
  }, [state]);

  function toggleSelection(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }

  function toggleAll() {
    setSelectedIds((current) =>
      current.length === todos.length ? [] : todos.map((todo) => todo.id),
    );
  }

  return (
    <section aria-label="Todo list" className="todo-list-section">
      {todos.length > 0 && (
        <div className="bulk-toolbar">
          <label className="select-all">
            <input
              checked={todos.length > 0 && selectedIds.length === todos.length}
              onChange={toggleAll}
              type="checkbox"
            />
            Select all
          </label>
          <form action={formAction} className="bulk-actions">
            {selectedIds.map((id) => (
              <input key={id} name="todoId" type="hidden" value={id} />
            ))}
            <button
              disabled={pending || selectedIds.length === 0}
              name="operation"
              type="submit"
              value="complete"
            >
              Complete
            </button>
            <button
              disabled={pending || selectedIds.length === 0}
              name="operation"
              type="submit"
              value="incomplete"
            >
              Reopen
            </button>
            <button
              className="danger-action"
              disabled={pending || selectedIds.length === 0}
              name="operation"
              type="submit"
              value="delete"
            >
              Delete
            </button>
          </form>
          {selectedIds.length > 0 && (
            <span className="selection-count">
              {selectedIds.length} selected
            </span>
          )}
        </div>
      )}

      {state.error && (
        <p aria-live="polite" className="form-message form-error">
          {state.error}
        </p>
      )}
      {state.message && (
        <p aria-live="polite" className="form-message form-success">
          {state.message}
        </p>
      )}

      {todos.length === 0 ? (
        <div className="empty-state">
          <span aria-hidden="true" className="empty-icon">
            ✓
          </span>
          <h2>Nothing on your list</h2>
          <p>Create a todo or adjust your search filters.</p>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li className={`todo-item${todo.completed ? " is-complete" : ""}`} key={todo.id}>
              <input
                aria-label={`Select ${todo.title}`}
                checked={selectedIds.includes(todo.id)}
                onChange={() => toggleSelection(todo.id)}
                type="checkbox"
              />
              <form action={toggleTodoAction}>
                <input name="id" type="hidden" value={todo.id} />
                <button
                  aria-label={todo.completed ? "Reopen todo" : "Complete todo"}
                  className={`completion-toggle${todo.completed ? " checked" : ""}`}
                  type="submit"
                >
                  {todo.completed ? "✓" : ""}
                </button>
              </form>

              <div className="todo-content">
                <div className="todo-title-row">
                  <h2>{todo.title}</h2>
                  <span className={`priority-badge priority-${todo.priority}`}>
                    {todo.priority}
                  </span>
                </div>
                {todo.description && <p>{todo.description}</p>}
                <div className="todo-meta">
                  <span>
                    Created{" "}
                    {now === null
                      ? "recently"
                      : relativeTime(todo.createdAt.toISOString(), now)}
                  </span>
                  {todo.updatedAt.getTime() - todo.createdAt.getTime() > 1000 && (
                    <span>
                      Updated{" "}
                      {now === null
                        ? "recently"
                        : relativeTime(todo.updatedAt.toISOString(), now)}
                    </span>
                  )}
                </div>
              </div>

              <div className="todo-item-actions">
                <Link
                  aria-label={`Edit ${todo.title}`}
                  className="icon-action"
                  href={`/edite/${todo.id}`}
                >
                  Edit
                </Link>
                <form action={deleteTodoAction}>
                  <input name="id" type="hidden" value={todo.id} />
                  <button
                    aria-label={`Delete ${todo.title}`}
                    className="icon-action danger-action"
                    type="submit"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
