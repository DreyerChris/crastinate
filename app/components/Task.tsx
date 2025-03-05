"use client";
import { CalendarIcon, CheckIcon, TrashIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { completeTaskAction, deleteTaskAction } from "../actions";
import type { tasksTable } from "../db/schema";

type TaskProps = {
	task: typeof tasksTable.$inferSelect;
};

export const Task = ({ task }: TaskProps) => {
	const [showActions, setShowActions] = useState(false);

	const deadlineDate = parseISO(task.deadlineDate);
	const now = new Date();

	const daysFromNow = Math.floor(
		(deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
	);

	const formattedDeadlineDate = format(deadlineDate, "MMM d, yyyy");
	const formattedCompletedDate = task.completedDate
		? format(parseISO(task.completedDate), "MMM d, yyyy")
		: "";

	const toggleActions = () => setShowActions(!showActions);

	return (
		<div className="relative">
			<button
				className={clsx(
					"card bg-base-300 shadow-sm w-full text-left rounded-lg",
					task.status === "completed"
						? "border-success border-[1px] border-l-6"
						: daysFromNow > 2
							? "border-l-6 border-success"
							: daysFromNow <= 2 && daysFromNow > -2
								? "border-l-6 border-warning"
								: "border-l-6 border-error",
				)}
				onClick={toggleActions}
				aria-expanded={showActions}
				type="button"
			>
				<div className="card-body p-2 flex-row items-center gap-2">
					{task.status !== "completed" && (
						<span
							className={clsx(
								"text-lg font-bold min-w-6 text-center",
								daysFromNow > 2
									? "text-success"
									: daysFromNow <= 2 && daysFromNow > -2
										? "text-warning"
										: "text-error",
							)}
						>
							{`${daysFromNow > 0 ? "-" : daysFromNow >= -1 && daysFromNow <= 0 ? "" : "+"}${Math.abs(daysFromNow)}d`}
						</span>
					)}

					<div className="flex-1 min-w-0 pr-1">
						<div className="flex items-baseline gap-2">
							<h3
								className={clsx(
									"text-base-content font-medium truncate flex-1",
									task.status === "completed" && "text-success",
								)}
							>
								{task.title}
							</h3>

							{task.status !== "completed" && (
								<span className="text-xs text-gray-500 whitespace-nowrap">
									{`due ${formattedDeadlineDate}`}
								</span>
							)}
						</div>
					</div>

					{task.status === "completed" && (
						<div className="text-xs text-success ml-auto">
							{formattedCompletedDate}
						</div>
					)}
					{task.status === "completed" && (
						<div className="flex gap-2 items-center">
							<CheckIcon className="w-4 h-4 text-success" />
						</div>
					)}
				</div>
			</button>

			{task.status !== "completed" && showActions && (
				<div className="absolute right-0 top-1/2 -translate-y-1/2 flex justify-center gap-3 bg-base-300 pr-2 rounded-md shadow-md z-10 animate-fadeIn">
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
