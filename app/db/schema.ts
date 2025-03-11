import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasksTable = sqliteTable(
	"tasks_table",
	{
		id: int().primaryKey({ autoIncrement: true }),
		userId: text().notNull(),
		title: text().notNull(),
		description: text(),
		type: text({ enum: ["recurring", "deadline", "one-off"] }).notNull(),
		deadlineDate: text().notNull(),
		status: text({ enum: ["pending", "completed", "deleted"] }).notNull(),
		completedDate: text(),
	},
	(table) => [
		index("userIdIndex").on(table.userId),
		index("deadlineDateIndex").on(table.deadlineDate),
		index("userStatusIndex").on(table.userId, table.status),
		index("userDeadlineIndex").on(table.userId, table.deadlineDate),
	],
);
