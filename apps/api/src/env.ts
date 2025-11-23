import { z } from "zod";

const envSchema = z.object({
	PORT: z.number().default(3000),
	OPENAI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
