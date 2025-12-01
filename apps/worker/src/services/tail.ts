export const tailHandler: ExportedHandlerTailHandler<Env> = async (events, env, ctx) => {
	events.forEach((event) => {
		event.logs.forEach((log) => {
			console.log(log.message);
		});
	});
};
