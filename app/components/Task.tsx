"use client";
import { CalendarIcon, CheckIcon, TrashIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useState } from "react";
import { completeTaskAction, deleteTaskAction } from "../actions";
import type { tasksTable } from "../db/schema";

type TaskProps = {
	task: typeof tasksTable.$inferSelect;
	variant?: "completed" | "upcoming";
};

export const Task = ({ task, variant = "upcoming" }: TaskProps) => {
	const [showActions, setShowActions] = useState(false);

	const daysFrom = Math.floor(
		(new Date(task.deadlineDate).getTime() - new Date().getTime()) /
			(1000 * 60 * 60 * 24),
	);

	const toggleActions = () => setShowActions(!showActions);

	return (
		<div className="relative">
			<button
				className={clsx(
					"card bg-base-300 shadow-sm w-full text-left rounded-lg",
					variant === "completed"
						? "border-success border-[1px] border-l-6"
						: daysFrom > 2
							? "border-l-6 border-success"
							: daysFrom <= 2 && daysFrom > -2
								? "border-l-6 border-warning"
								: "border-l-6 border-error",
				)}
				onClick={toggleActions}
				aria-expanded={showActions}
				type="button"
			>
				<div className="card-body p-2 flex-row items-center gap-2">
					{/* Days indicator - made more compact */}
					{variant === "upcoming" && (
						<span
							className={clsx(
								"text-lg font-bold min-w-6 text-center",
								daysFrom > 2
									? "text-success"
									: daysFrom <= 2 && daysFrom > -2
										? "text-warning"
										: "text-error",
							)}
						>
							{`${daysFrom > 0 ? "-" : daysFrom === -1 ? "" : "+"}${Math.abs(daysFrom)}d`}
						</span>
					)}

					{/* Task title - expanded to take more space */}
					<div className="flex-1 min-w-0 pr-1">
						<div className="flex items-baseline gap-2">
							<h3
								className={clsx(
									"text-base-content truncate flex-1 font-bold",
									variant === "completed" && "text-success",
								)}
							>
								{task.title}
							</h3>

							{/* Due date - moved inline with title */}
							{variant === "upcoming" && (
								<span className="text-xs text-gray-500 whitespace-nowrap">
									{`due ${new Date(task.deadlineDate).toLocaleDateString()}`}
								</span>
							)}
							{variant === "completed" && task.completedDate && (
								<div className="text-xs text-success">
									Completed: {new Date(task.completedDate).toLocaleDateString()}
								</div>
							)}
						</div>

						{/* Completed date */}
					</div>

					{/* Completed indicator */}
					{variant === "completed" && (
						<div className="flex gap-2 items-center">
							<CheckIcon className="w-4 h-4 text-success" />
						</div>
					)}
				</div>
			</button>

			{/* Action buttons toolbar - only shown when task is clicked */}
			{variant === "upcoming" && showActions && (
				<div className="absolute bg-base-300 right-0 top-1/2 -translate-y-1/2 flex justify-center gap-3 p-2 rounded-md shadow-md z-10 animate-fadeIn">
					<button
						className="bg-warning p-2 rounded-full group cursor-pointer flex items-center gap-2"
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							deleteTaskAction(task.id);
							setShowActions(false);
						}}
					>
						<CalendarIcon className="w-4 h-4 text-warning-content group-hover:scale-110 transition-all" />
					</button>
					<button
						className="bg-error p-2 rounded-full group cursor-pointer flex items-center gap-2"
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							deleteTaskAction(task.id);
							setShowActions(false);
						}}
					>
						<TrashIcon className="w-4 h-4 text-error-content group-hover:scale-110 transition-all" />
					</button>
					<button
						className="bg-success p-2 rounded-full group cursor-pointer flex items-center gap-2"
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							completeTaskAction(task.id);
							setShowActions(false);
						}}
					>
						<CheckIcon className="w-4 h-4 text-success-content group-hover:scale-110 transition-all" />
					</button>
				</div>
			)}
		</div>
	);
};
