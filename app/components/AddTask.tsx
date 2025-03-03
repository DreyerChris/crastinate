"use client";

import { addTaskAction } from "../actions";

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
			<dialog id="add_task_modal" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Add a new task</h3>
					<div className="modal-action">
						<form action={addTaskAction}>
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
			</dialog>
		</>
	);
};
