import { CheckIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import React from "react";
import type { tasksTable } from "../db/schema";

type CompletedTaskProps = {
	task: typeof tasksTable.$inferSelect;
};

const CompletedTask = ({ task }: CompletedTaskProps) => {
	const formattedCompletedDate = task.completedDate
		? format(parseISO(task.completedDate), "MMM d, yyyy")
		: "";

	return (
		<div className="p-2 flex items-center justify-between gap-2 text-sm w-full bg-base-200 rounded-md">
			<div className="flex items-center justify-between gap-2 flex-1">
				<h3
					className={clsx(
						"font-medium",
						task.status === "completed" && "text-success",
					)}
				>
					{task.title}
				</h3>

				<div className="flex items-center gap-2">
					<div className="flex gap-2 items-center">
						<CheckIcon className="w-4 h-4 text-success" />
					</div>

					<div className="text-xs text-success ml-auto">
						{formattedCompletedDate}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CompletedTask;
