"use server";

import { redirect } from "next/navigation";
import type { TodoStatus } from "@/app/types/todo";

export async function searchTodosAction(formData: FormData): Promise<void> {
  const query = formData.get("query");
  const status = formData.get("status");
  const params = new URLSearchParams();

  if (typeof query === "string" && query.trim()) {
    params.set("q", query.trim());
  }
  if (status === "active" || status === "completed") {
    params.set("status", status satisfies TodoStatus);
  }

  const search = params.toString();
  redirect(search ? `/?${search}` : "/");
}
