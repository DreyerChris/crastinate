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
		<div className="absolute bottom-6 right-6 z-100">
			<button
				type="button"
				className="btn btn-square btn-secondary"
				onClick={() => setThemeMenuOpen(!themeMenuOpen)}
			>
				<PaintBrushIcon className="w-5 h-5" />
			</button>
			{themeMenuOpen && (
				<div className="relative">
					<div className="absolute bottom-0 right-0">
						<div className="bg-base-100 rounded-lg shadow-lg">
							<div className="flex flex-col gap-2 items-end">
								<ThemeButton
									theme="dark"
									onClick={() => handleThemeChange("dark")}
								/>
								<ThemeButton
									theme="sunset"
									onClick={() => handleThemeChange("sunset")}
								/>
								<ThemeButton
									theme="synthwave"
									onClick={() => handleThemeChange("synthwave")}
								/>
								<ThemeButton
									theme="forest"
									onClick={() => handleThemeChange("forest")}
								/>
								<ThemeButton
									theme="dracula"
									onClick={() => handleThemeChange("dracula")}
								/>
								<ThemeButton
									theme="dim"
									onClick={() => handleThemeChange("dim")}
								/>
								<ThemeButton
									theme="night"
									onClick={() => handleThemeChange("night")}
								/>
								<ThemeButton
									theme="abyss"
									onClick={() => handleThemeChange("abyss")}
								/>
								<ThemeButton
									theme="business"
									onClick={() => handleThemeChange("business")}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

const ThemeButton = ({
	theme,
	onClick,
}: { theme: string; onClick: () => void }) => {
	return (
		<button
			data-theme={theme}
			type="button"
			className="btn btn-sm btn-ghost"
			onClick={onClick}
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
