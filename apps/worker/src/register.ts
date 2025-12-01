import { Command, Option, register } from "discord-hono";

const commands = [
	new Command("echo", "Echoes a message")
		.options(new Option("message", "The message to echo", "String").required())
		.toJSON(),

	new Command("ping", "response Pong"),
	new Command("image", "Generates an image"),
];

async function main() {
	try {
		await register(commands, process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_TOKEN);
		console.log("Successfully registered commands!");
	} catch (error) {
		console.error("Failed to register commands:", error);
	}
}

main();
