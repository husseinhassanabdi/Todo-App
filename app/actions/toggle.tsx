"use server";

import { revalidatePath } from "next/cache";
import { toggleTodo } from "@/app/lib/todo";

export async function toggleTodoAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("Todo ID is required.");
  }

  await toggleTodo(id);
  revalidatePath("/");
}