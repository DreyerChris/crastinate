import clsx from "clsx";
import {
  CalendarIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type TaskProps = {
  title: string;
  description: string;
  daysFrom: number;
};

export const Task = ({ title, description, daysFrom }: TaskProps) => {
  return (
    <div
      className={clsx(
        "w-full bg-base-100 border-l-6 border-green-300 py-2 pr-4 rounded-md flex items-center gap-2",
        daysFrom < -2
          ? "border-green-500"
          : daysFrom < 1
            ? "border-yellow-500"
            : "border-red-500",
      )}
    >
      <span
        className={clsx(
          "text-xl font-bold min-w-8 text-center",
          daysFrom < -2
            ? "text-green-500"
            : daysFrom < 1
              ? "text-yellow-500"
              : "text-red-500",
        )}
      >
        {daysFrom}d
      </span>
      <h1>{title}</h1>
      <div className="flex gap-2 ml-auto items-center">
        <div className="tooltip" data-tip="Procrastinate">
          <CalendarIcon className="w-4 h-4 text-yellow-500 cursor-pointer hover:scale-125 transition-all" />
        </div>
        <div className="tooltip" data-tip="Remove">
          <TrashIcon className="w-4 h-4 text-red-500 cursor-pointer hover:scale-125 transition-all" />
        </div>
        <div className="tooltip" data-tip="Complete">
          <CheckIcon className="w-4 h-4 text-green-500 cursor-pointer hover:scale-125 transition-all" />
        </div>
      </div>
    </div>
  );
};
