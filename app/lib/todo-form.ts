import { priorities, type TodoPriority } from "@/app/types/todo";

export type TodoInput = {
  title: string;
  description: string;
  priority: TodoPriority;
};

function isTodoPriority(value: unknown): value is TodoPriority {
  return (
    typeof value === "string" &&
    priorities.some((priority) => priority === value)
  );
}

export function parseTodoFormData(
  formData: FormData,
): { input: TodoInput } | { error: string } {
  const title = formData.get("title");
  const description = formData.get("description");
  const priority = formData.get("priority");

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Enter a title for this todo." };
  }
  if (title.trim().length > 120) {
    return { error: "Todo titles must be 120 characters or fewer." };
  }
  if (typeof description !== "string" || description.length > 1000) {
    return { error: "Descriptions must be 1,000 characters or fewer." };
  }
  if (!isTodoPriority(priority)) {
    return { error: "Choose a valid priority." };
  }

  return {
    input: { title: title.trim(), description: description.trim(), priority },
  };
}
