"use server";

import { revalidatePath } from "next/cache";
import { deleteTodo } from "@/app/lib/todo";

export async function deleteTodoAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("Todo ID is required.");
  }

  await deleteTodo(id);
  revalidatePath("/");
}