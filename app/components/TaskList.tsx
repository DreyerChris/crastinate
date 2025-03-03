import { auth } from "@clerk/nextjs/server";
import { QUERIES } from "../db/queries";
import { Task } from "./Task";

export const TaskList = async () => {
	const { userId } = await auth();
	const tasks = await QUERIES.getUpcomingTasks(userId ?? "");
	const completedTasks = await QUERIES.getCompletedTasks(userId ?? "");

	return (
		<div className="w-full flex flex-col gap-2 h-9/12 md:10/12">
			<article className="prose self-start !mb-2">
				<h2 className="text-accent">Upcoming</h2>
			</article>
			<div className="w-full overflow-y-auto overflow-x-hidden flex flex-col gap-2">
				{tasks.map((task) => (
					<Task key={task.id} task={task} />
				))}
			</div>
			<article className="prose self-start !my-2">
				<h2 className="text-accent">Completed</h2>
			</article>
			<div className="w-full flex flex-col gap-2 py-2">
				{completedTasks.map((task) => (
					<Task key={task.id} task={task} variant="completed" />
				))}
			</div>
		</div>
	);
};
