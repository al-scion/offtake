import { McpServer, StreamableHttpTransport } from "mcp-lite";
import { z } from "zod";

const mcp = new McpServer({
	name: "my-server",
	version: "1.0.0",
	schemaAdapter: (schema) => z.toJSONSchema(schema as z.ZodType),
});

const transport = new StreamableHttpTransport({
	allowedHosts: undefined,
	allowedOrigins: undefined,
	sessionAdapter: undefined,
	clientRequestAdapter: undefined,
});

export const mcpHandler = transport.bind(mcp);

mcp.use(async (ctx, next) => {
	console.log(`${ctx.request.method} - Request ID: ${ctx.requestId}`);
	const startTime = performance.now();
	await next();
	const endTime = performance.now();
	console.log(`${(endTime - startTime).toFixed(2)}ms`);
});

// Static resource
mcp.resource(
	"static-resource",
	{
		name: "static-resource",
		mimeType: "text/plain",
		description: "Static resource",
	},
	async (uri) => ({
		contents: [
			{
				uri: uri.href,
				type: "text",
				text: "App configuration here",
				mimeType: "text/plain",
			},
		],
	})
);

// Dynamic resource
mcp.resource(
	"github://repos/{owner}/{repo}",
	{
		name: "dynamic-resource",
		mimeType: "text/plain",
		description: "Dynamic resource",
	},
	async (uri, args) => ({
		contents: [
			{
				uri: uri.href,
				type: "text",
				text: `Hello, ${args.owenr} ${args.repo}!`,
				mimeType: "text/plain",
			},
		],
	})
);

const promptSchema = z.object({ message: z.string(), length: z.number() });

mcp.prompt("my-prompt", {
	title: "My Prompt",
	description: "My prompt",
	inputSchema: z.object({ message: z.string() }),
	arguments: promptSchema,
	handler: (args, ctx) => {
		return {
			messages: [],
		};
	},
	// handler: async (args) => ({
	// 	description: "My prompt",
	// 	messages: [
	// 		{
	// 			role: "user",
	// 			content: {
	// 				type: "text",
	// 				text: `Hello, world! ${JSON.stringify(args)}`,
	// 			},
	// 		},
	// 	],
	// }),
});

mcp.tool("echo", {
	description: "Echo the input",
	inputSchema: z.object({
		message: z.string(),
	}),
	handler: async (args, ctx) => {
		return { content: [{ type: "text", text: args.message }] };
	},
});

// mcp.tool("poem", {
// 	description: "My tool",
// 	inputSchema: z.object({ title: z.string() }),
// 	handler: async (args) =>
// 		new Promise((resolve) => {
// 			const stream = createUIMessageStream({
// 				execute: async ({ writer }) => {
// 					const response = streamText({
// 						model: openai("gpt-5-mini"),
// 						prompt: `Write a poem about ${args.title}`,
// 						experimental_telemetry: {
// 							isEnabled: true,
// 							recordInputs: true,
// 							recordOutputs: true,
// 						},
// 					});

// 					writer.merge(
// 						response.toUIMessageStream({
// 							sendSources: true,
// 							messageMetadata: () => {},
// 						})
// 					);
// 				},
// 				onFinish: (props) => {
// 					console.log(props);
// 					resolve({
// 						content: [{ type: "text", text: JSON.stringify(props.responseMessage) }],
// 					});
// 				},
// 			});

// 			const messageStream = readUIMessageStream({ stream });
// 			const messageStreamHandler = async () => {
// 				for await (const message of messageStream) {
// 					console.log(message.parts);
// 				}
// 			};
// 			messageStreamHandler();
// 		}),
// });
