"use client";

import { createContext, useContext, useOptimistic } from "react";
import type { tasksTable } from "../db/schema";

type TasksContextType = {
	optimisticUpcomingTasks: (typeof tasksTable.$inferSelect)[];
	updateOptimisticUpcomingTasks: (action: {
		type: "add" | "delete" | "update" | "set";
		task: typeof tasksTable.$inferSelect;
		newState?: (typeof tasksTable.$inferSelect)[];
	}) => void;
	optimisticCompletedTasks: (typeof tasksTable.$inferSelect)[];
	updateOptimisticCompletedTasks: (action: {
		type: "add" | "delete" | "update" | "set";
		task: typeof tasksTable.$inferSelect;
		newState?: (typeof tasksTable.$inferSelect)[];
	}) => void;
};

export const TasksContext = createContext<TasksContextType | undefined>(
	undefined,
);

export default function TasksProvider({
	children,
	upcomingTasks,
	completedTasks,
}: {
	children: React.ReactNode;
	upcomingTasks: (typeof tasksTable.$inferSelect)[];
	completedTasks: (typeof tasksTable.$inferSelect)[];
}) {
	const [optimisticUpcomingTasks, updateOptimisticUpcomingTasks] =
		useOptimistic(
			upcomingTasks,
			(
				state: (typeof tasksTable.$inferSelect)[],
				{
					type,
					task,
					newState,
				}: {
					type: "add" | "delete" | "update" | "set";
					task: typeof tasksTable.$inferSelect;
					newState?: (typeof tasksTable.$inferSelect)[];
				},
			) => {
				switch (type) {
					case "add":
						if (!task) return state;
						return [...state, task];
					case "delete":
						return state.filter((t) => t.id !== task.id);
					case "update":
						return state.map((t) => (t.id === task.id ? task : t));
					case "set":
						return newState ?? state;
					default:
						return state;
				}
			},
		);
	const [optimisticCompletedTasks, updateOptimisticCompletedTasks] =
		useOptimistic(
			completedTasks,
			(
				state: (typeof tasksTable.$inferSelect)[],
				{
					type,
					task,
					newState,
				}: {
					type: "add" | "delete" | "update" | "set";
					task: typeof tasksTable.$inferSelect;
					newState?: (typeof tasksTable.$inferSelect)[];
				},
			) => {
				switch (type) {
					case "add":
						return [...state, task];
					case "delete":
						return state.filter((t) => t.id !== task.id);
					case "update":
						return state.map((t) => (t.id === task.id ? task : t));
					case "set":
						return newState ?? state;
					default:
						return state;
				}
			},
		);

	return (
		<TasksContext.Provider
			value={{
				optimisticUpcomingTasks,
				updateOptimisticUpcomingTasks,
				optimisticCompletedTasks,
				updateOptimisticCompletedTasks,
			}}
		>
			{children}
		</TasksContext.Provider>
	);
}

export function useTasks() {
	const context = useContext(TasksContext);
	if (context === undefined) {
		throw new Error("useTasks must be used within a TasksProvider");
	}
	return context;
}
