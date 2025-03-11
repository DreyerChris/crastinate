import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";
import Background from "./components/Background";
import ClientOnly from "./components/ClientOnly";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Crastinate",
	description: "Get more done",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const theme = cookieStore.get("theme")?.value ?? "dark";

	return (
		<ClerkProvider appearance={{ baseTheme: dark }}>
			<html lang="en" data-theme={theme} className="w-full h-full dark">
				<SpeedInsights />
				<head>
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
					/>
					<link rel="icon" type="image/x-icon" href="favicon.ico" />
				</head>

				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased h-dvh w-full`}
				>
					<ClientOnly>
						<Background />
					</ClientOnly>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
