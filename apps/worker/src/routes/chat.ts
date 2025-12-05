import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	streamText,
	validateUIMessages,
} from "ai";
import { Hono } from "hono";
import type { MessageType } from "@/types";

export const chatRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

chatRouter.post("/", async (c) => {
	const { id, messages } = await c.req.json();
	const validMessages = await validateUIMessages<MessageType>({ messages });
	const modelMessages = convertToModelMessages(validMessages);

	const controller = new AbortController();

	const stream = createUIMessageStream<MessageType>({
		execute: async ({ writer }) => {
			const response = streamText({
				model: c.var.registry.languageModel("google/gemini-2.5-flash"),
				messages: modelMessages,
				abortSignal: controller.signal,
				onFinish: (props) => {},
			});

			writer.merge(
				response.toUIMessageStream({
					sendSources: true,
					onFinish: (props) => {},
					messageMetadata: ({ part }) => {
						if (part.type === "start-step") {
							return { startTime: Date.now() };
						}
						if (part.type === "finish-step") {
							return { endTime: Date.now() };
						}
					},
				})
			);
		},
		onFinish: (props) => {},
	});

	const [streamForResponse, streamForProcessing] = stream.tee();

	const messageStreamResponse = createUIMessageStreamResponse({
		stream: streamForResponse,
	});

	return messageStreamResponse;
});
