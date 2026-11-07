"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/app/lib/action-state";
import { createTodo } from "@/app/lib/todo";
import { parseTodoFormData } from "@/app/lib/todo-form";

export async function createTodoAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseTodoFormData(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  await createTodo(parsed.input);
  revalidatePath("/");
  redirect("/");
}