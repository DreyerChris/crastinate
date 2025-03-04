import { addDays } from "date-fns";
import { and, desc, eq, gte, lte, or } from "drizzle-orm";
import { db } from ".";
import { tasksTable } from "./schema";

export const QUERIES = {
	getUpcomingTasks: async (userId: string, days: number) => {
		const tasks = await db
			.select()
			.from(tasksTable)
			.where(
				and(
					eq(tasksTable.userId, userId),
					eq(tasksTable.status, "pending"),
					or(
						lte(
							tasksTable.deadlineDate,
							addDays(new Date(), days).toISOString(),
						),
					),
				),
			)
			.orderBy(desc(tasksTable.deadlineDate));
		return tasks;
	},
	getCompletedTasks: async (userId: string) => {
		const tasks = await db
			.select()
			.from(tasksTable)
			.where(
				and(eq(tasksTable.userId, userId), eq(tasksTable.status, "completed")),
			)
			.limit(3);
		return tasks;
	},
	getTaskById: async (taskId: number) => {
		const tasks = await db
			.select()
			.from(tasksTable)
			.limit(1)
			.where(eq(tasksTable.id, taskId));
		return tasks[0];
	},
};

export const MUTATIONS = {
	createTask: async (task: typeof tasksTable.$inferInsert) => {
		await db.insert(tasksTable).values(task);
	},
	createTasks: async (tasks: (typeof tasksTable.$inferInsert)[]) => {
		await db.insert(tasksTable).values(tasks);
	},
	deleteTask: async (taskId: number) => {
		await db
			.update(tasksTable)
			.set({ status: "deleted" })
			.where(eq(tasksTable.id, taskId));
	},
	completeTask: async (taskId: number) => {
		await db
			.update(tasksTable)
			.set({ status: "completed", completedDate: new Date().toISOString() })
			.where(eq(tasksTable.id, taskId));
	},
};
