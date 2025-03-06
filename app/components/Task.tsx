"use client";
import {
	ArrowPathIcon,
	CalendarIcon,
	CheckIcon,
	ExclamationCircleIcon,
	TrashIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import { addDays, format, parseISO } from "date-fns";
import { startTransition, useState } from "react";
import {
	completeTaskAction,
	deleteTaskAction,
	postponeTaskAction,
} from "../actions";
import type { tasksTable } from "../db/schema";
import { useTasks } from "../providers/TasksProvider";

type TaskProps = {
	task: typeof tasksTable.$inferSelect;
};

export const Task = ({ task }: TaskProps) => {
	const {
		updateOptimisticUpcomingTasks,
		updateOptimisticCompletedTasks,
		optimisticCompletedTasks,
	} = useTasks();
	const [showActions, setShowActions] = useState(false);
	const [showPostponeActions, setShowPostponeActions] = useState(false);

	const deadlineDate = parseISO(task.deadlineDate);
	const now = new Date();

	const daysFromNow = Math.ceil(
		(deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
	);

	const formattedDeadlineDate = format(deadlineDate, "MMM d, yyyy");
	const formattedCompletedDate = task.completedDate
		? format(parseISO(task.completedDate), "MMM d, yyyy")
		: "";

	const toggleActions = () => {
		setShowActions(!showActions);
		setShowPostponeActions(false);
	};

	const handlePostpone = (days: number) => {
		setShowPostponeActions(false);
		setShowActions(false);
		startTransition(async () => {
			updateOptimisticUpcomingTasks({
				type: "update",
				task: {
					...task,
					deadlineDate: addDays(task.deadlineDate, days).toISOString(),
				},
			});
			await postponeTaskAction(
				task.id,
				addDays(task.deadlineDate, days).toISOString(),
			);
		});
	};

	return (
		<div className="relative">
			<button
				className={clsx(
					"card bg-base-300 shadow-sm w-full text-left rounded-lg",
					task.status === "completed"
						? "border-success border-[1px] border-l-6"
						: daysFromNow > 2
							? "border-l-6 border-success"
							: daysFromNow <= 2 && daysFromNow >= 0
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
									: daysFromNow <= 2 && daysFromNow >= 0
										? "text-warning"
										: "text-error",
							)}
						>
							{`${daysFromNow > 0 ? "-" : daysFromNow >= -1 && daysFromNow <= 0 ? "" : "+"}${Math.abs(daysFromNow)}d`}
						</span>
					)}

					<div className="flex items-center justify-between gap-2 w-full pr-1">
						<h3
							className={clsx(
								"text-base-content font-medium truncate flex-1",
								task.status === "completed" && "text-success",
							)}
						>
							{task.title}
						</h3>

						{task.status !== "completed" && (
							<div className="flex items-center gap-2">
								<span className="text-xs whitespace-nowrap">
									{task.type === "deadline" ? (
										<ExclamationCircleIcon
											className={clsx(
												"w-4 h-4",
												daysFromNow <= 2
													? "text-error"
													: "text-neutral-content",
											)}
										/>
									) : task.type === "recurring" ? (
										<ArrowPathIcon className="w-4 h-4 text-neutral-content" />
									) : (
										<CalendarIcon className="w-4 h-4 text-neutral-content" />
									)}
								</span>
								<span className="text-xs text-gray-500 whitespace-nowrap">
									{`due ${formattedDeadlineDate}`}
								</span>
							</div>
						)}

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
				</div>
			</button>

			{showPostponeActions && (
				<div className="absolute right-0 top-1/2 -translate-y-1/2 flex justify-center gap-3 bg-base-300 rounded-md shadow-md z-10 animate-fadeIn">
					<PostponeButton days={1} onClick={() => handlePostpone(1)} />
					<PostponeButton days={5} onClick={() => handlePostpone(5)} />
					<PostponeButton days={7} onClick={() => handlePostpone(7)} />
				</div>
			)}
			{task.status !== "completed" && showActions && !showPostponeActions && (
				<div className="absolute right-0 top-1/2 -translate-y-1/2 flex justify-center gap-3 bg-base-300 pr-2 rounded-md shadow-md z-10 animate-fadeIn">
					<button
						className="bg-warning p-2 rounded-full group cursor-pointer flex items-center gap-2"
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setShowPostponeActions(true);
						}}
					>
						<CalendarIcon className="w-4 h-4 text-warning-content group-hover:scale-110 transition-all" />
					</button>
					<button
						className="bg-error p-2 rounded-full group cursor-pointer flex items-center gap-2"
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setShowActions(false);
							startTransition(async () => {
								updateOptimisticUpcomingTasks({
									type: "delete",
									task,
								});
								await deleteTaskAction(task.id);
							});
						}}
					>
						<TrashIcon className="w-4 h-4 text-error-content group-hover:scale-110 transition-all" />
					</button>
					<button
						className="bg-success p-2 rounded-full group cursor-pointer flex items-center gap-2"
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setShowActions(false);
							startTransition(async () => {
								updateOptimisticUpcomingTasks({
									type: "delete",
									task,
								});
								updateOptimisticCompletedTasks({
									type: "set",
									task,
									newState: [
										{ ...task, status: "completed" },
										...optimisticCompletedTasks.slice(0, -1),
									],
								});
								await completeTaskAction(task.id);
							});
						}}
					>
						<CheckIcon className="w-4 h-4 text-success-content group-hover:scale-110 transition-all" />
					</button>
				</div>
			)}
		</div>
	);
};

const PostponeButton = ({
	days,
	onClick,
}: { days: number; onClick: () => void }) => {
	return (
		<button
			type="button"
			className="bg-secondary text-secondary-content w-8 h-8 rounded-full cursor-pointer flex items-center justify-center gap-2"
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{days}d
		</button>
	);
};
