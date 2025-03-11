"use client";
import { useTasks } from "../providers/TasksProvider";
import CompletedTask from "./CompletedTask";
import { Task } from "./Task";

type TaskListProps = {
	completed?: boolean;
};

export const TaskList = ({ completed }: TaskListProps) => {
	const { optimisticUpcomingTasks, optimisticCompletedTasks } = useTasks();

	return (
		<>
			{completed
				? optimisticCompletedTasks.map((task) => (
						<CompletedTask key={task.id} task={task} />
					))
				: optimisticUpcomingTasks.map((task) => (
						<Task key={task.id} task={task} />
					))}
		</>
	);
};
