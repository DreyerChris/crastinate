"use client";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

type DatePickerProps = {
	id: string;
	required?: boolean;
};

export default function DatePicker({ id, required = true }: DatePickerProps) {
	const [date, setDate] = useState<Date | undefined>();
	const [isOpen, setIsOpen] = useState(false);

	// Convert date to UTC ISO string for form submission
	const toUTCString = (date: Date | undefined): string => {
		if (!date) return "";

		// Create a new date with UTC time components
		const utcDate = new Date(
			Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
		);

		return utcDate.toISOString();
	};

	// Format date for display
	const formatDateForDisplay = (date: Date | undefined): string => {
		return date ? format(date, "MMM d, yyyy") : "Pick a date";
	};

	const handleDateSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		setIsOpen(false);

		// Update the hidden input and trigger form validation
		const input = document.getElementById(id) as HTMLInputElement;
		if (input) {
			input.value = selectedDate ? toUTCString(selectedDate) : "";
			input.dispatchEvent(new Event("change", { bubbles: true }));
		}
	};

	return (
		<div className="relative">
			<input
				type="hidden"
				id={id}
				name={id}
				required={required}
				value={date ? toUTCString(date) : ""}
			/>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="input input-border w-full text-left text-base"
				style={{ anchorName: "--rdp" } as React.CSSProperties}
				type="button"
				aria-label="Select date"
				aria-expanded={isOpen}
				aria-controls={`${id}-picker`}
			>
				{formatDateForDisplay(date)}
			</button>
			{isOpen && (
				<div
					id={`${id}-popover`}
					className="dropdown absolute top-0 left-0 z-50 bg-base-200 rounded-lg shadow-lg"
					style={{ positionAnchor: "--rdp" } as React.CSSProperties}
				>
					<DayPicker
						id={`${id}-picker`}
						className="react-day-picker"
						mode="single"
						selected={date}
						onSelect={handleDateSelect}
						required={required}
					/>
				</div>
			)}
		</div>
	);
}
