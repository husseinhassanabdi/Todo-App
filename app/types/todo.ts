export const priorities = ["low", "medium", "high"] as const;
export type TodoPriority = (typeof priorities)[number];
export type TodoStatus = "all" | "active" | "completed";

export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: Date;
  updatedAt: Date;
};