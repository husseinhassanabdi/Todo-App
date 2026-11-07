"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/app/lib/action-state";
import { applyBulkTodos } from "@/app/lib/todo";

export async function bulkTodosAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ids = formData
    .getAll("todoId")
    .filter((id): id is string => typeof id === "string");
  const operation = formData.get("operation");

  if (
    operation !== "delete" &&
    operation !== "complete" &&
    operation !== "incomplete"
  ) {
    return { error: "Choose a bulk operation." };
  }
  if (ids.length === 0) {
    return { error: "Select at least one todo." };
  }

  const count = await applyBulkTodos(ids, operation);
  revalidatePath("/");
  const noun = count === 1 ? "todo" : "todos";
  const verb = operation === "delete" ? "deleted" : "updated";
  return { message: `${count} ${noun} ${verb}.` };
}
