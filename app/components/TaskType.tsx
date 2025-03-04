"use client";
import {
	ArrowPathIcon,
	CalendarIcon,
	CheckIcon,
} from "@heroicons/react/16/solid";
import React, { useState } from "react";
import DatePicker from "./ui/DatePicker";

const TASK_TYPES = [
	{
		id: "one-off",
		label: "One-off",
		icon: CheckIcon,
		description: "A single task to complete",
	},
	{
		id: "deadline",
		label: "Deadline",
		icon: CalendarIcon,
		description: "Task with a specific due date",
	},
	{
		id: "recurring",
		label: "Recurring",
		icon: ArrowPathIcon,
		description: "Task that repeats regularly",
	},
] as const;

const FREQUENCIES = [
	{ id: "daily", label: "Daily" },
	{ id: "weekly", label: "Weekly" },
	{ id: "monthly", label: "Monthly" },
	{ id: "yearly", label: "Yearly" },
] as const;

type TaskType = (typeof TASK_TYPES)[number]["id"];
type Frequency = (typeof FREQUENCIES)[number]["id"];

const TaskType = () => {
	const [selectedType, setSelectedType] = useState<TaskType>("one-off");
	const [frequency, setFrequency] = useState<Frequency>("weekly");

	return (
		<div className="space-y-4">
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Task Type</legend>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{TASK_TYPES.map(({ id, label, icon: Icon, description }) => (
						<button
							key={id}
							type="button"
							onClick={() => setSelectedType(id)}
							className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
								selectedType === id
									? "border-primary bg-primary/10"
									: "border-base-300 hover:border-primary/50"
							}`}
						>
							<Icon
								className={`w-6 h-6 ${
									selectedType === id ? "text-primary" : "text-base-content"
								}`}
							/>
							<div className="text-center">
								<div className="font-medium text-base">{label}</div>
								<div className="text-sm text-base-content/70">
									{description}
								</div>
							</div>
							<input
								type="radio"
								name="type"
								value={id}
								checked={selectedType === id}
								onChange={() => setSelectedType(id)}
								className="hidden"
							/>
						</button>
					))}
				</div>
			</fieldset>

			{(selectedType === "one-off" || selectedType === "deadline") && (
				<fieldset className="fieldset">
					<legend className="fieldset-legend">Due Date</legend>
					<DatePicker id="deadlineDate" />
				</fieldset>
			)}

			{selectedType === "recurring" && (
				<>
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Frequency</legend>
						<select
							value={frequency}
							onChange={(e) => setFrequency(e.target.value as Frequency)}
							className="select select-bordered w-full"
							name="recurringFrequency"
							id="recurringFrequency"
						>
							{FREQUENCIES.map(({ id, label }) => (
								<option key={id} value={id}>
									{label}
								</option>
							))}
						</select>
					</fieldset>
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Start Date</legend>
						<DatePicker id="recurringStartDate" />
					</fieldset>
				</>
			)}
		</div>
	);
};

export default TaskType;
