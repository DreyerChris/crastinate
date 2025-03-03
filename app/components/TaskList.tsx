import { auth } from "@clerk/nextjs/server";
import { QUERIES } from "../db/queries";
import { Task } from "./Task";

export const TaskList = async () => {
	const { userId } = await auth();
	const tasks = await QUERIES.getUpcomingTasks(userId ?? "");

	return (
		<div className="w-full flex flex-col gap-2">
			<article className="prose self-start !mb-6">
				<h2 className="text-primary">Highlighted</h2>
			</article>
			{tasks.map((task) => (
				<div key={task.id} className="w-full">
					<Task task={task} />
				</div>
			))}
		</div>
	);
};
