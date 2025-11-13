import { z } from "zod";

const envSchema = z.object({
	// VITE_CLERK_PUBLISHABLE_KEY: z.string(),
	// VITE_CLERK_SIGN_IN_URL: z.string(),
	// VITE_CLERK_SIGN_UP_URL: z.string(),
	// VITE_CONVEX_URL: z.string(),
	VITE_MAPBOX_TOKEN: z.string(),
	VITE_WORKOS_CLIENT_ID: z.string(),
	VITE_WORKOS_REDIRECT_URI: z.string(),
});

export const env = envSchema.parse(import.meta.env);