import type { InferUITool, UIMessage } from "ai";
import { z } from "zod";

const metadataSchema = z
	.object({
		startTime: z.number().optional(),
		endTime: z.number().optional(),
		model: z.string().optional(),
	})
	.catchall(z.unknown());

const dataPartSchema = z.object({
	data: z.record(z.string(), z.any()),
});

const tools = {};

export type Metadata = z.infer<typeof metadataSchema>;
export type DataPart = z.infer<typeof dataPartSchema>;
export type Tools = { [K in keyof typeof tools]: InferUITool<(typeof tools)[K]> };
export type MessageType = UIMessage<Metadata, DataPart, Tools>;
