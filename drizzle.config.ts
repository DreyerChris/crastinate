import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./app/db/schema.ts",
	dialect: "turso",
	dbCredentials: {
		// biome-ignore lint:
		url: process.env.TURSO_DATABASE_URL!,
		// biome-ignore lint:
		authToken: process.env.TURSO_AUTH_TOKEN!,
	},
});
