import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { QUERIES } from "../db/queries";
import { Task } from "./Task";
import SegmentedControl from "./ui/SegmentedControl";

export const TaskList = async ({ days }: { days: number }) => {
	const { userId } = await auth();
	const tasks = await QUERIES.getUpcomingTasks(userId ?? "", days);
	const completedTasks = await QUERIES.getCompletedTasks(userId ?? "");

	return (
		<div className="w-full flex flex-col gap-2 h-9/12 md:10/12">
			<div className="flex items-center justify-between">
				<article className="prose">
					<h2 className="text-accent">Upcoming</h2>
				</article>
				<SegmentedControl
					value={days.toString()}
					options={[
						{ id: "5", label: "+5d" },
						{ id: "15", label: "+15d" },
						{ id: "30", label: "+30d" },
					]}
					name="upcoming-filter"
					onChange={async (value) => {
						"use server";
						console.log(value);
						redirect(`/?days=${value}`);
					}}
				/>
			</div>
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
