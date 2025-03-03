"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { MUTATIONS, QUERIES } from "../db/queries";
import type { tasksTable } from "../db/schema";

export const addTaskAction = async (formData: FormData) => {
	const { userId } = await auth();

	if (!userId) {
		return;
	}

	const rawFormData = {
		customerId: formData.get("customerId"),
		amount: formData.get("amount"),
		status: formData.get("status"),
	};

	const task: typeof tasksTable.$inferInsert = {
		title: "Test",
		description: "Test",
		userId,
		type: "one-off",
		deadlineDate: "2025-03-05",
		status: "pending",
	};

	await MUTATIONS.createTask(task);
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
