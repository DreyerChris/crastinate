import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AddTask } from "./components/AddTask";
import Background from "./components/Background";
import { TaskList } from "./components/TaskList";
import ThemeSwitcher from "./components/ThemeSwitcher";
import SegmentedControl from "./components/ui/SegmentedControl";
import { QUERIES } from "./db/queries";
import TasksProvider from "./providers/TasksProvider";
export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ days: string }>;
}) {
	const { userId } = await auth();
	const days = Number.parseInt((await searchParams).days ?? "7");

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
			<div className="relative flex flex-col items-center justify-center h-full w-full p-0 py-2 md:p-4 bg-gray-900 gap-6">
				<Background />
				<ThemeSwitcher />
				<div className="z-1 relative bg-base-300 px-4 py-8 lg:p-8 flex flex-col justify-center items-center gap-6 rounded-md max-h-full w-full md:min-w-1/2">
					<div className="shadow-md absolute w-full h-2 rounded-tr rounded-tl -top-2 animate-gradient z-1" />
					<article className="text-center prose z-0">
						<h1 className="text-white">CRASTINATE</h1>
					</article>
					<div className="w-full flex flex-col gap-2 h-9/12 md:10/12">
						<div className="flex items-center justify-between">
							<article className="prose">
								<h2 className="text-primary">Upcoming</h2>
							</article>
							<SegmentedControl
								value={days.toString()}
								options={[
									{ id: "7", label: "Day" },
									{ id: "15", label: "Week" },
									{ id: "30", label: "Month" },
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
							<h2 className="text-primary">Completed</h2>
						</article>
						<div className="w-full flex flex-col gap-2">
							<TaskList completed />
						</div>
					</div>

					<AddTask daysFilter={days.toString() as "5" | "15" | "30"} />
				</div>
			</div>
		</TasksProvider>
	);
}
