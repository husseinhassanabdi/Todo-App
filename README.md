# Todo List

A Next.js 15.4 todo app backed by MongoDB.

## Setup

1. Install dependencies with `npm install`.
2. Set `DATABASE_TYPE` to `atlas` or `local` in `.env.local`. For Atlas, provide `ATLAS_MONGODB_URI` (or `MONGODB_URI_PRO` / `MONGODB_URI`); for local MongoDB, provide `LOCAL_MONGODB_URI` (or `MONGODB_URI`). Optionally set `MONGODB_DB` to use a database other than `todo_app`.
3. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).

## Features

- Create and edit todos with low, medium, or high priority and validation feedback.
- Search todo titles and descriptions, filter by completion, and sort high-priority items first.
- Select multiple todos to delete, complete, or reopen them.
- Track creation and update timestamps with live relative-time labels.
- Persist todo data in MongoDB; all mutations update `updatedAt`.
