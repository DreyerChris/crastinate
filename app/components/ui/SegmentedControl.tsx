"use client";

import clsx from "clsx";
import { useState } from "react";

type Option<T extends string> = {
	id: T;
	label: string;
	icon?: React.ComponentType<{ className?: string }>;
};

type SegmentedControlProps<T extends string> = {
	options: Option<T>[];
	value: T;
	onChange: (value: T) => void;
	name: string;
	className?: string;
};

export default function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
	name,
	className,
}: SegmentedControlProps<T>) {
	const [hoveredId, setHoveredId] = useState<T | null>(null);

	return (
		<div
			className={clsx("relative flex rounded-lg p-1 bg-base-200", className)}
			role="radiogroup"
		>
			<div
				className={clsx(
					"absolute h-[calc(100%-8px)] top-1 transition-all duration-200 rounded-md bg-base-100 shadow-sm mx-2",
					hoveredId ? "opacity-50" : "opacity-0",
				)}
				style={{
					width: `${100 / options.length}%`,
					left: `${(options.findIndex((o) => o.id === (hoveredId || value)) * 100) / options.length}%`,
				}}
			/>

			{options.map((option) => (
				<label
					key={option.id}
					onMouseEnter={() => setHoveredId(option.id)}
					onMouseLeave={() => setHoveredId(null)}
					className={clsx(
						"flex-1 flex items-center justify-center gap-2 py-1 px-3 rounded-md cursor-pointer relative transition-colors z-10",
						value === option.id
							? "text-secondary-content bg-secondary"
							: "hover:text-secondary-content hover:bg-secondary",
					)}
				>
					{option.icon && (
						<option.icon
							className={clsx(
								"w-4 h-4 transition-colors",
								value === option.id ? "text-primary" : "text-base-content",
							)}
						/>
					)}
					<span className="font-medium">{option.label}</span>
					<input
						type="radio"
						name={name}
						value={option.id}
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="hidden"
					/>
				</label>
			))}
		</div>
	);
}
