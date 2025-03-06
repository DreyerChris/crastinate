"use client";

import { PaintBrushIcon, SwatchIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
	const [theme, setTheme] = useState("sunset");
	const [themeMenuOpen, setThemeMenuOpen] = useState(false);

	useEffect(() => {
		const currentTheme = document.documentElement.getAttribute("data-theme");
		setTheme(currentTheme || "light");
	}, []);

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme);
		setThemeMenuOpen(false);
		document.documentElement.setAttribute("data-theme", newTheme);
		document.cookie = `theme=${newTheme}; path=/; max-age=31536000`; // 1-year expiry
	};

	return (
		<>
			{themeMenuOpen && (
				<div
					className="fixed inset-0 z-40"
					onClick={() => setThemeMenuOpen(false)}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setThemeMenuOpen(false);
						}
					}}
					aria-hidden="true"
				/>
			)}

			<div className="absolute bottom-6 right-6 z-50">
				<button
					type="button"
					className="btn btn-square btn-secondary"
					onClick={() => setThemeMenuOpen(!themeMenuOpen)}
					aria-label="Change theme"
					aria-expanded={themeMenuOpen}
				>
					<PaintBrushIcon className="w-5 h-5" />
				</button>
				{themeMenuOpen && (
					<div className="relative">
						<div className="absolute bottom-12 right-0">
							<div className="bg-base-100 rounded-lg shadow-lg">
								<div className="flex flex-col gap-2 items-end py-2">
									<ThemeButton
										theme="dark"
										onClick={() => handleThemeChange("dark")}
										isActive={theme === "dark"}
									/>
									<ThemeButton
										theme="sunset"
										onClick={() => handleThemeChange("sunset")}
										isActive={theme === "sunset"}
									/>
									<ThemeButton
										theme="synthwave"
										onClick={() => handleThemeChange("synthwave")}
										isActive={theme === "synthwave"}
									/>
									<ThemeButton
										theme="forest"
										onClick={() => handleThemeChange("forest")}
										isActive={theme === "forest"}
									/>
									<ThemeButton
										theme="dracula"
										onClick={() => handleThemeChange("dracula")}
										isActive={theme === "dracula"}
									/>
									<ThemeButton
										theme="dim"
										onClick={() => handleThemeChange("dim")}
										isActive={theme === "dim"}
									/>
									<ThemeButton
										theme="night"
										onClick={() => handleThemeChange("night")}
										isActive={theme === "night"}
									/>
									<ThemeButton
										theme="abyss"
										onClick={() => handleThemeChange("abyss")}
										isActive={theme === "abyss"}
									/>
									<ThemeButton
										theme="business"
										onClick={() => handleThemeChange("business")}
										isActive={theme === "business"}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

const ThemeButton = ({
	theme,
	onClick,
	isActive = false,
}: {
	theme: string;
	onClick: () => void;
	isActive?: boolean;
}) => {
	return (
		<button
			data-theme={theme}
			type="button"
			className={`btn btn-sm ${isActive ? "btn-active" : "btn-ghost"}`}
			onClick={onClick}
			aria-pressed={isActive}
		>
			{theme}
			<div className="w-4 h-4 bg-primary rounded" />
			<div className="w-4 h-4 bg-secondary rounded" />
			<div className="w-4 h-4 bg-accent rounded" />
			<div className="w-4 h-4 bg-neutral rounded" />
			<div className="w-4 h-4 bg-base-100 rounded" />
		</button>
	);
};
