import { ObjectId, type Filter } from "mongodb";
import { getDb } from "@/app/lib/db";
import {
  priorities,
  type Todo,
  type TodoPriority,
  type TodoStatus,
} from "@/app/types/todo";

export { priorities, type Todo, type TodoPriority, type TodoStatus };

type TodoDocument = Omit<Todo, "id">;

function isTodoPriority(value: unknown): value is TodoPriority {
  return (
    typeof value === "string" &&
    priorities.some((priority) => priority === value)
  );
}

function toTodo(document: TodoDocument & { _id: ObjectId }): Todo {
  return {
    id: document._id.toString(),
    title: document.title,
    description: document.description,
    completed: document.completed,
    priority: isTodoPriority(document.priority) ? document.priority : "medium",
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listTodos(options: {
  query?: string;
  status?: TodoStatus;
} = {}): Promise<Todo[]> {
  const collection = (await getDb()).collection<TodoDocument>("todos");
  const conditions: Filter<TodoDocument>[] = [];
  const query = options.query?.trim();

  if (query) {
    const regex = { $regex: escapeRegex(query), $options: "i" };
    conditions.push({
      $or: [{ title: regex }, { description: regex }],
    });
  }

  if (options.status === "active") {
    conditions.push({ completed: false });
  } else if (options.status === "completed") {
    conditions.push({ completed: true });
  }

  const filter: Filter<TodoDocument> = conditions.length
    ? { $and: conditions }
    : {};
  const documents = await collection.find(filter).toArray();
  const priorityOrder: Record<TodoPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return documents
    .map(toTodo)
    .sort(
      (a, b) =>
        priorityOrder[a.priority] - priorityOrder[b.priority] ||
        b.createdAt.getTime() - a.createdAt.getTime(),
    );
}

export async function getTodo(id: string): Promise<Todo | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const document = await (await getDb())
    .collection<TodoDocument>("todos")
    .findOne({ _id: new ObjectId(id) });

  return document ? toTodo(document) : null;
}

export async function createTodo(input: {
  title: string;
  description: string;
  priority: TodoPriority;
}): Promise<void> {
  const now = new Date();
  await (await getDb()).collection<TodoDocument>("todos").insertOne({
    ...input,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateTodo(
  id: string,
  input: { title: string; description: string; priority: TodoPriority },
): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await (await getDb())
    .collection<TodoDocument>("todos")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...input, updatedAt: new Date() } },
    );

  return result.matchedCount > 0;
}

export async function deleteTodo(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid todo ID.");
  }

  await (await getDb())
    .collection<TodoDocument>("todos")
    .deleteOne({ _id: new ObjectId(id) });
}

export async function toggleTodo(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid todo ID.");
  }

  const collection = (await getDb()).collection<TodoDocument>("todos");
  const objectId = new ObjectId(id);
  const result = await collection.updateOne(
    { _id: objectId },
    [
      {
        $set: {
          completed: { $not: ["$completed"] },
          updatedAt: "$$NOW",
        },
      },
    ],
  );
  if (result.matchedCount === 0) {
    throw new Error("Todo not found.");
  }
}

export async function applyBulkTodos(
  ids: string[],
  operation: "delete" | "complete" | "incomplete",
): Promise<number> {
  if (ids.length === 0 || ids.some((id) => !ObjectId.isValid(id))) {
    throw new Error("Select at least one valid todo.");
  }

  const objectIds = ids.map((id) => new ObjectId(id));
  const collection = (await getDb()).collection<TodoDocument>("todos");

  if (operation === "delete") {
    const result = await collection.deleteMany({ _id: { $in: objectIds } });
    return result.deletedCount;
  }

  const result = await collection.updateMany(
    { _id: { $in: objectIds } },
    {
      $set: {
        completed: operation === "complete",
        updatedAt: new Date(),
      },
    },
  );
  return result.modifiedCount;
}
