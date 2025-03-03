import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { AddTask } from "./components/AddTask";
import Background from "./components/Background";
import { TaskList } from "./components/TaskList";
import { db } from "./db";
import { tasksTable } from "./db/schema";

export default async function Home() {
	const { userId } = await auth();

	if (!userId) {
		return <div>Sign in to view this page</div>;
	}

	return (
		<div className="relative flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 gap-6">
			<Background />
			<div className="z-1 relative bg-zinc-950 p-8 flex flex-col justify-center items-center gap-10 rounded-md">
				<article className="text-center prose z-0">
					<h1 className="text-white">What will you complete today?</h1>
				</article>
				<TaskList />
				<AddTask />
			</div>
		</div>
	);
}
