import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Background from "./components/Background";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider appearance={{ baseTheme: dark }}>
			<html lang="en" data-theme="sunset" className="w-full h-full dark">
				<head>
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
					/>
				</head>

				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased h-dvh w-full`}
				>
					<Background />
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
