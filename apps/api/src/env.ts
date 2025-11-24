import { z } from "zod";

const envSchema = z.object({
	PORT: z.number().default(3000),
	OPENAI_API_KEY: z.string(),
	WORKOS_API_KEY: z.string(),
	WORKOS_CLIENT_ID: z.string(),
	CLIENT_URL: z.string(),
});

export const env = envSchema.parse(process.env);
