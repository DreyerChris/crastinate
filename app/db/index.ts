import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql/web";

export const db = drizzle({
	connection: {
		// biome-ignore lint:
		url: process.env.TURSO_DATABASE_URL!,
		// biome-ignore lint:
		authToken: process.env.TURSO_AUTH_TOKEN!,
	},
});
