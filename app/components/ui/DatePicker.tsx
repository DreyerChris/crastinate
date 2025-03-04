import { useState } from "react";
import { DayPicker } from "react-day-picker";

type DatePickerProps = {
	id: string;
	required?: boolean;
};

export default function DatePicker({ id, required = true }: DatePickerProps) {
	const [date, setDate] = useState<Date | undefined>();
	const [isOpen, setIsOpen] = useState(false);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		setIsOpen(false);

		// Update the hidden input and trigger form validation
		const input = document.getElementById(id) as HTMLInputElement;
		if (input) {
			input.value = selectedDate
				? selectedDate.toISOString().split("T")[0]
				: "";
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
				value={date ? date.toISOString().split("T")[0] : ""}
			/>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="input input-border w-full text-left"
				style={{ anchorName: "--rdp" } as React.CSSProperties}
				type="button"
				aria-label="Select date"
				aria-expanded={isOpen}
				aria-controls={`${id}-picker`}
			>
				{date ? date.toLocaleDateString() : "Pick a date"}
			</button>
			{isOpen && (
				<div
					id={`${id}-popover`}
					className="dropdown absolute z-50 bg-base-200 rounded-lg shadow-lg"
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
