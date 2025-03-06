"use client";
import { useCallback, useMemo, useRef } from "react";

const COLOR_CLASSES = [
	"bg-primary/20 border-primary",
	"bg-secondary/20 border-secondary",
	"bg-accent/20 border-accent",
	"bg-success/20 border-success",
	"bg-warning/20 border-warning",
	"bg-error/20 border-error",
] as const;

export default function Background() {
	// Use a ref to store active cells instead of state
	const activeCells = useRef(new Set<string>());
	const timeouts = useRef(new Map<string, NodeJS.Timeout>());

	// Memoize the grid size calculation
	const gridSize = useMemo(() => {
		const columns = Math.ceil(window.innerWidth / 30);
		const rows = Math.ceil(window.innerHeight / 30);
		return {
			columns,
			rows,
			total: columns * rows,
		};
	}, []);

	// Pre-generate random color classes for each possible cell
	const colorClassMap = useMemo(() => {
		const map = new Map<number, (typeof COLOR_CLASSES)[number]>();
		for (let i = 0; i < gridSize.total; i++) {
			map.set(
				i,
				COLOR_CLASSES[Math.floor(Math.random() * COLOR_CLASSES.length)],
			);
		}
		return map;
	}, [gridSize.total]);

	// Handle mouse enter event
	const handleMouseEnter = useCallback(
		(index: number, element: HTMLDivElement) => {
			const key = index.toString();

			// Clear existing timeout if any
			if (timeouts.current.has(key)) {
				clearTimeout(timeouts.current.get(key));
			}

			// Add active class
			element.className = `w-8 h-8 border z-1 ${colorClassMap.get(index)}`;
			activeCells.current.add(key);

			// Set timeout to remove active class
			const timeout = setTimeout(() => {
				element.className =
					"w-8 h-8 border z-1 bg-base border-base-300 border-[1px]";
				activeCells.current.delete(key);
				timeouts.current.delete(key);
			}, 1000);

			timeouts.current.set(key, timeout);
		},
		[colorClassMap],
	);

	return (
		<div
			className="absolute top-0 left-0 w-full h-full grid overflow-hidden"
			style={{
				gridTemplateColumns: `repeat(${gridSize.columns}, 30px)`,
				gridTemplateRows: `repeat(${gridSize.rows}, 30px)`,
			}}
		>
			<div className="absolute top-0 left-0 w-full h-full bg-base-300 brightness-50 z-0 overflow-hidden" />

			{/* Render cells */}
			{Array.from({ length: gridSize.total }, (_, i) => (
				<div
					key={window.crypto.randomUUID()}
					ref={(el) => {
						if (el) {
							el.onmouseenter = () => handleMouseEnter(i, el);
						}
					}}
					className="w-8 h-8 z-1 bg-base border-base-300 border-[1px]"
				/>
			))}
		</div>
	);
}
