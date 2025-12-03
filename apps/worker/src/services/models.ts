import { type AnthropicProviderOptions, anthropic } from "@ai-sdk/anthropic";
// import { gateway } from "@ai-sdk/gateway";
import { type GoogleGenerativeAIProviderOptions, google } from "@ai-sdk/google";
import { type OpenAIResponsesProviderOptions, openai } from "@ai-sdk/openai";
import { createProviderRegistry } from "ai";

export const registry = createProviderRegistry(
	{
		openai,
		// gateway,
		anthropic,
		google,
	},
	{ separator: "/" }
);

export type ProviderOptions = {
	google?: GoogleGenerativeAIProviderOptions;
	openai?: OpenAIResponsesProviderOptions;
	anthropic?: AnthropicProviderOptions;
};

export const toolLibrary = {
	google_search: google.tools.googleSearch({}),
	url_context: google.tools.urlContext({}),
};
