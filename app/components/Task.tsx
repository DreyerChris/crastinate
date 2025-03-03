"use client";
import {
	CalendarIcon,
	CheckIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { deleteTaskAction } from "../actions";
import type { tasksTable } from "../db/schema";

type TaskProps = {
	task: typeof tasksTable.$inferSelect;
};

export const Task = ({ task }: TaskProps) => {
	const daysFrom = Math.floor(
		(new Date(task.deadlineDate).getTime() - new Date().getTime()) /
			(1000 * 60 * 60 * 24),
	);

	return (
		<div
			className={clsx(
				"w-full bg-base-100 border-l-6 border-green-300 py-2 pr-4 rounded-md flex items-center gap-2",
				daysFrom < -2
					? "border-green-500"
					: daysFrom < 1
						? "border-yellow-500"
						: "border-red-500",
			)}
		>
			<span
				className={clsx(
					"text-xl font-bold min-w-8 text-center",
					daysFrom < -2
						? "text-green-500"
						: daysFrom < 1
							? "text-yellow-500"
							: "text-red-500",
				)}
			>
				{daysFrom}d
			</span>
			<h1>{task.title}</h1>
			<div className="flex gap-2 ml-auto items-center">
				<div className="tooltip" data-tip="Procrastinate">
					<CalendarIcon className="w-4 h-4 text-yellow-500 cursor-pointer hover:scale-125 transition-all" />
				</div>
				<div className="tooltip" data-tip="Remove">
					<button type="submit" onClick={() => deleteTaskAction(task.id)}>
						<TrashIcon className="w-4 h-4 text-red-500 cursor-pointer hover:scale-125 transition-all" />
					</button>
				</div>
				<div className="tooltip" data-tip="Complete">
					<CheckIcon className="w-4 h-4 text-green-500 cursor-pointer hover:scale-125 transition-all" />
				</div>
			</div>
		</div>
	);
};
