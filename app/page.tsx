import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AddTask } from "./components/AddTask";
import Background from "./components/Background";
import { TaskList } from "./components/TaskList";
import SegmentedControl from "./components/ui/SegmentedControl";
import { QUERIES } from "./db/queries";
import TasksProvider from "./providers/TasksProvider";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ days: string }>;
}) {
	const { userId } = await auth();
	const days = Number.parseInt((await searchParams).days ?? "5");

	if (!userId) {
		return <div>Sign in to view this page</div>;
	}

	const upcomingTasks = await QUERIES.getUpcomingTasks(userId ?? "", days);
	const completedTasks = await QUERIES.getCompletedTasks(userId ?? "");

	return (
		<TasksProvider
			upcomingTasks={upcomingTasks}
			completedTasks={completedTasks}
		>
			<div className="relative flex flex-col items-center justify-center h-full w-full p-4 bg-gray-900 gap-6">
				<Background />
				<div className="z-1 relative bg-zinc-950 px-4 py-8 lg:p-8 flex flex-col justify-center items-center gap-6 rounded-md max-h-full">
					<div className="absolute w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-tr rounded-tl -top-2" />
					<article className="text-center prose z-0">
						<h1 className="text-white">What will you complete today?</h1>
					</article>
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
							<TaskList />
						</div>
						<article className="prose self-start !my-2">
							<h2 className="text-accent">Completed</h2>
						</article>
						<div className="w-full flex flex-col gap-2 py-2">
							<TaskList completed />
						</div>
					</div>

					<AddTask daysFilter={days.toString() as "5" | "15" | "30"} />
				</div>
			</div>
		</TasksProvider>
	);
}
