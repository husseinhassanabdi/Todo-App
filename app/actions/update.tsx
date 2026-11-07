"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/app/lib/action-state";
import { updateTodo } from "@/app/lib/todo";
import { parseTodoFormData } from "@/app/lib/todo-form";

export async function updateTodoAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Todo ID is required." };
  }

  const parsed = parseTodoFormData(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const updated = await updateTodo(id, parsed.input);
  if (!updated) {
    return { error: "Todo not found." };
  }

  revalidatePath("/");
  redirect("/");
}