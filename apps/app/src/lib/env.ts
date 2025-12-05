import { z } from "zod";

const envSchema = z.object({
	VITE_WORKOS_CLIENT_ID: z.string(),
	VITE_WORKOS_REDIRECT_URI: z.string(),
	VITE_SERVER_URL: z.string(),
	VITE_CONVEX_URL: z.string(),
	VITE_WORKER_URL: z.string(),
});

export const env = envSchema.parse(import.meta.env);
