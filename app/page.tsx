import Background from "./components/Background";
import { Task } from "./components/Task";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 gap-6">
      <Background />
      <div className="z-1 relative bg-zinc-950 p-8 flex flex-col justify-center items-center gap-10 rounded-md">
        <article className="text-center prose z-0">
          <h1 className="text-white">What will you achieve today?</h1>
        </article>
        <article className="prose self-start">
          <h2 className="text-primary">Highlighted</h2>
        </article>
        <button className="btn btn-primary" type="button">
          Add task
        </button>
      </div>
    </div>
  );
}
