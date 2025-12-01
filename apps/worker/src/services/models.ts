import { anthropic } from "@ai-sdk/anthropic";
import { gateway } from "@ai-sdk/gateway";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { createProviderRegistry } from "ai";

export const registry = createProviderRegistry(
	{
		openai,
		gateway,
		anthropic,
		google,
	},
	{ separator: "/" }
);
