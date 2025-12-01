import { experimental_generateImage as generateImage, generateText } from "ai";
import { DiscordHono } from "discord-hono";
import { registry } from "./models";

type Variables = {
	message: string;
};

export const discord = new DiscordHono<{ Bindings: Env; Variables: Variables }>();

discord.command("ping", (c) => c.res("Pong!!"));
discord.command("echo", (c) => {
	const message = c.var.message;
	console.log("Input message:", message);
	return c.resDefer(async (c) => {
		// const response = await generateText({
		// 	model: registry.languageModel("google/gemini-2.5-flash"),
		// 	prompt: message,
		// });

		// console.log("Response:", response.text.toString());

		// await c.followup(response.text.toString());

		const response = await generateText({
			model: registry.languageModel("google/gemini-3-pro-image-preview"),
			prompt: message,
		});

		const img = response.files[0]!;
		const blob = new Blob([new Uint8Array(img.uint8Array)], { type: img.mediaType });

		await c.followup("", { blob, name: "image.jpg" });
	});
});

discord.command("image", (c) => {
	return c.resDefer(async (c) => {
		const message = c.var.message;
		const response = await generateText({
			model: registry.languageModel("google/gemini-3-pro-image-preview"),
			prompt: message,
		});

		const img = response.files[0]!;
		const blob = new Blob([new Uint8Array(img.uint8Array)], { type: img.mediaType });

		await c.followup("", { blob, name: "image.jpg" });
	});
});
