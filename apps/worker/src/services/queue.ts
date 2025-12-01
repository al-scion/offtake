export type MessageQueue = {
	data: Record<string, unknown>;
};

export const queueHandler: ExportedHandlerQueueHandler<Env> = async (batch, env, ctx) => {
	for (const message of batch.messages) {
		console.log("message", message);
		const payload = message.body;
		// Do something else with the message

		message.ack();
	}
};
