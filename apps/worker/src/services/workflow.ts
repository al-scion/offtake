import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";

export type WorkflowParams = {
	url: string;
};

export class Workflow extends WorkflowEntrypoint<Env, WorkflowParams> {
	async run(event: WorkflowEvent<WorkflowParams>, step: WorkflowStep) {
		const params = event.payload;

		await step.do("log", {}, async () => {
			console.log("Workflow started");
		});

		// await step.sleep("sleep", 1000 satisfies WorkflowSleepDuration);
	}
}
