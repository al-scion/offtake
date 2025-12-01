import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/workspace/$workspaceId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { workspaceId } = useParams({ from: Route.id });

	return <div>Hello "/_authenticated/workspace/$workspaceId"!</div>;
}
