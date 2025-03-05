"use client";

import { createContext, useContext, useOptimistic } from "react";
import type { tasksTable } from "../db/schema";

type TasksContextType = {
	optimisticUpcomingTasks: (typeof tasksTable.$inferSelect)[];
	addOptimisticUpcomingTask: (_task: typeof tasksTable.$inferSelect) => void;
	optimisticCompletedTasks: (typeof tasksTable.$inferSelect)[];
	addOptimisticCompletedTask: (_task: typeof tasksTable.$inferSelect) => void;
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
	const [optimisticUpcomingTasks, addOptimisticUpcomingTask] = useOptimistic(
		upcomingTasks,
		(
			state: (typeof tasksTable.$inferSelect)[],
			newTask: typeof tasksTable.$inferSelect,
		) => {
			return [...state, newTask];
		},
	);
	const [optimisticCompletedTasks, addOptimisticCompletedTask] = useOptimistic(
		completedTasks,
		(
			state: (typeof tasksTable.$inferSelect)[],
			newTask: typeof tasksTable.$inferSelect,
		) => {
			return [...state, newTask];
		},
	);

	return (
		<TasksContext.Provider
			value={{
				optimisticUpcomingTasks,
				addOptimisticUpcomingTask,
				optimisticCompletedTasks,
				addOptimisticCompletedTask,
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
