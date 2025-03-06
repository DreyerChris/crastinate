"use server";
import { auth } from "@clerk/nextjs/server";
import { add, parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { MUTATIONS, QUERIES } from "../db/queries";
import type { tasksTable } from "../db/schema";

type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly";
type TaskType = "one-off" | "deadline" | "recurring";
type TaskStatus = "pending" | "completed" | "deleted";

// Ensure date is in UTC format
const ensureUTCDate = (dateString: string): string => {
	if (!dateString) return "";

	try {
		// Parse the date and ensure it's in UTC
		const date = parseISO(dateString);
		return date.toISOString();
	} catch (error) {
		console.error("Invalid date format:", dateString);
		return dateString;
	}
};

const getRecurringTaskDates = (
	startDate: string,
	frequency: RecurringFrequency,
	count = 12,
): string[] => {
	const dates: string[] = [];
	// Parse the start date as UTC
	const start = parseISO(startDate);
	const duration =
		frequency === "yearly"
			? "years"
			: frequency === "monthly"
				? "months"
				: frequency === "weekly"
					? "weeks"
					: "days";

	for (let i = 0; i < count; i++) {
		// Add the interval and ensure UTC format
		const nextDate = add(start, { [duration]: i });
		dates.push(nextDate.toISOString());
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
		// Get the next 12 occurrences of the recurring task with UTC dates
		const dates = getRecurringTaskDates(
			ensureUTCDate(rawFormData.recurringStartDate),
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
			deadlineDate: ensureUTCDate(rawFormData.deadlineDate),
			status: "pending" as const,
		};

		await MUTATIONS.createTask(task);
		revalidatePath("/");
	} else {
		throw new Error("Invalid task data");
	}
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

	const completedDate = new Date().toISOString();

	await MUTATIONS.completeTask(taskId, completedDate);
	revalidatePath("/");
};

export const postponeTaskAction = async (
	taskId: number,
	deadlineDate: string,
) => {
	const { userId } = await auth();
	const task = await QUERIES.getTaskById(taskId);

	if (!userId || task.userId !== userId) {
		return;
	}

	await MUTATIONS.postponeTask(taskId, deadlineDate);
	revalidatePath("/");
};
