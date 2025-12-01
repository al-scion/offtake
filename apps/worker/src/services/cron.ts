export const cronHandler: ExportedHandlerScheduledHandler<Env> = async (controller, env, ctx) => {
	console.log("cron", controller.cron);
	console.log("time", controller.scheduledTime);

	switch (controller.cron) {
		case "0 0 * * *": {
			console.log("daily cron");
			break;
		}
		case "*/5 * * * *": {
			// Every 5 minutes
			console.log("5-minute cron - SSE processing removed");
			break;
		}
		case "*/10 * * * *": {
			// Better Stack heartbeat - every 10 minutes
			try {
				const response = await fetch("https://uptime.betterstack.com/api/v1/heartbeat/uuB87829UhjD6jAK1g8egvoR");
				console.log("Heartbeat sent successfully", response.status);
			} catch (error) {
				console.error("Failed to send heartbeat", error);
			}

			break;
		}
		default: {
			console.log("other cron");
			break;
		}
	}
};
