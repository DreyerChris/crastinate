"use client";
import { CalendarIcon, CheckIcon, TrashIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { completeTaskAction, deleteTaskAction } from "../actions";
import type { tasksTable } from "../db/schema";

type TaskProps = {
	task: typeof tasksTable.$inferSelect;
	variant?: "completed" | "upcoming";
};

export const Task = ({ task, variant = "upcoming" }: TaskProps) => {
	const daysFrom = Math.floor(
		(new Date(task.deadlineDate).getTime() - new Date().getTime()) /
			(1000 * 60 * 60 * 24),
	);

	return (
		<div
			className={clsx(
				"w-full bg-base-300 border-l-6 py-2 px-4 rounded-md flex items-center gap-2",
				variant === "completed"
					? "border-success border-[1px] border-l-6"
					: daysFrom < -2
						? "border-success"
						: daysFrom < 1
							? "border-warning"
							: "border-error",
			)}
		>
			{variant === "upcoming" && (
				<span
					className={clsx(
						"text-xl font-bold min-w-8 pr-2 text-center",
						daysFrom < -2
							? "text-success"
							: daysFrom < 1
								? "text-warning"
								: "text-error",
					)}
				>
					{`${daysFrom > 0 ? "+" : ""}${daysFrom}d`}
				</span>
			)}
			<span
				className={clsx(
					"text-base-content",
					variant === "completed" && "text-success",
				)}
			>
				{task.title}
			</span>
			{variant === "upcoming" && (
				<div className="flex gap-2 ml-auto items-center">
					<div className="tooltip" data-tip="Procrastinate">
						<button
							className="bg-warning p-2 rounded group cursor-pointer"
							type="submit"
							onClick={() => deleteTaskAction(task.id)}
						>
							<CalendarIcon className="w-4 h-4 text-warning-content cursor-pointer group-hover:scale-125 transition-all" />
						</button>
					</div>
					<div className="tooltip" data-tip="Remove">
						<button
							className="bg-error p-2 rounded group cursor-pointer"
							type="submit"
							onClick={() => deleteTaskAction(task.id)}
						>
							<TrashIcon className="w-4 h-4 text-error-content cursor-pointer group-hover:scale-125 transition-all" />
						</button>
					</div>
					<div className="tooltip" data-tip="Complete">
						<button
							className="bg-success p-2 rounded group cursor-pointer"
							type="submit"
							onClick={() => completeTaskAction(task.id)}
						>
							<CheckIcon className="size-4 text-success-content cursor-pointer group-hover:scale-125 transition-all" />
						</button>
					</div>
				</div>
			)}
			{variant === "completed" && (
				<div className="flex gap-2 ml-auto items-center">
					<CheckIcon className="w-4 h-4 text-success cursor-pointer group-hover:scale-125 transition-all" />
				</div>
			)}
		</div>
	);
};
