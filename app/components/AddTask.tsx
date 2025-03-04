"use client";

import { addTaskAction } from "../actions";
import TaskType from "./TaskType";

export const AddTask = () => {
	return (
		<>
			<button
				className="btn btn-primary"
				// @ts-ignore
				onClick={() => document.getElementById("add_task_modal")?.showModal()}
				type="button"
			>
				Add Task
			</button>
			<dialog id="add_task_modal" className="modal w-full">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Add a new task</h3>
					<div className="modal-body">
						<form action={addTaskAction} className="flex flex-col gap-4 mt-6">
							<fieldset className="fieldset">
								<legend className="fieldset-legend">Title</legend>
								<input
									className="input"
									placeholder="Add a title for your task"
									name="title"
								/>
							</fieldset>
							<fieldset className="fieldset">
								<legend className="fieldset-legend">Description</legend>
								<textarea
									className="textarea h-6"
									placeholder="Describe your task"
									name="description"
								/>
								<div className="fieldset-label">Optional</div>
							</fieldset>
							<TaskType />
							<button
								type="submit"
								className="btn btn-primary"
								onClick={() =>
									document
										.getElementById("add_task_modal")
										// @ts-ignore
										?.close()
								}
							>
								Submit
							</button>
						</form>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button type="button">close</button>
				</form>
			</dialog>
		</>
	);
};
