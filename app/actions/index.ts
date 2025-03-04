"use server";
import { auth } from "@clerk/nextjs/server";
import { add } from "date-fns";
import { revalidatePath } from "next/cache";
import { MUTATIONS, QUERIES } from "../db/queries";
import type { tasksTable } from "../db/schema";

type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly";
type TaskType = "one-off" | "deadline" | "recurring";
type TaskStatus = "pending" | "completed" | "deleted";

const getRecurringTaskDates = (
	startDate: string,
	frequency: RecurringFrequency,
) => {
	const dates: string[] = [];
	const start = new Date(startDate);
	const durationMultiplier =
		frequency === "yearly"
			? 1
			: frequency === "monthly"
				? 12
				: frequency === "weekly"
					? 52
					: 365;
	const duration =
		frequency === "yearly"
			? "years"
			: frequency === "monthly"
				? "months"
				: frequency === "weekly"
					? "weeks"
					: "days";

	for (let i = 0; i < durationMultiplier * 1; i++) {
		dates.push(
			add(start, { [duration]: i })
				.toISOString()
				.split("T")[0],
		);
	}
	return dates;
};

export const addTaskAction = async (formData: FormData) => {
	const { userId } = await auth();

	if (!userId) {
		return;
	}

	const rawFormData = {
		title: formData.get("title") as string,
		description: formData.get("description") as string | null,
		type: formData.get("type") as TaskType,
		deadlineDate: formData.get("deadlineDate") as string | null,
		recurringFrequency: formData.get(
			"recurringFrequency",
		) as RecurringFrequency | null,
		recurringStartDate: formData.get("recurringStartDate") as string | null,
	};

	if (!rawFormData.title) {
		throw new Error("Title is required");
	}

	if (
		rawFormData.type === "recurring" &&
		rawFormData.recurringFrequency &&
		rawFormData.recurringStartDate
	) {
		// Get the next 12 occurrences of the recurring task
		const dates = getRecurringTaskDates(
			rawFormData.recurringStartDate,
			rawFormData.recurringFrequency,
		);

		// Create all recurring tasks at once
		const tasks: (typeof tasksTable.$inferInsert)[] = dates.map((date) => ({
			title: rawFormData.title,
			description: rawFormData.description,
			userId,
			type: "recurring" as const,
			deadlineDate: date,
			status: "pending" as const,
		}));

		await MUTATIONS.createTasks(tasks);
	} else if (rawFormData.deadlineDate) {
		const task: typeof tasksTable.$inferInsert = {
			title: rawFormData.title,
			description: rawFormData.description,
			userId,
			type: rawFormData.type,
			deadlineDate: rawFormData.deadlineDate,
			status: "pending" as const,
		};

		await MUTATIONS.createTask(task);
	} else {
		throw new Error("Invalid task data");
	}

	revalidatePath("/");
};

export const deleteTaskAction = async (taskId: number) => {
	const { userId } = await auth();
	const task = await QUERIES.getTaskById(taskId);

	if (!userId || task.userId !== userId) {
		return;
	}

	await MUTATIONS.deleteTask(taskId);
	revalidatePath("/");
};

export const completeTaskAction = async (taskId: number) => {
	const { userId } = await auth();
	const task = await QUERIES.getTaskById(taskId);

	if (!userId || task.userId !== userId) {
		return;
	}

	await MUTATIONS.completeTask(taskId);
	revalidatePath("/");
};
