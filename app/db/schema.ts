import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasksTable = sqliteTable("users_table", {
	id: int().primaryKey({ autoIncrement: true }),
	userId: text().notNull(),
	title: text().notNull(),
	description: text(),
	type: text({ enum: ["recurring", "deadline", "one-off"] }).notNull(),
	deadlineDate: text().notNull(),
	status: text({ enum: ["pending", "completed", "deleted"] }).notNull(),
	completedDate: text(),
});
