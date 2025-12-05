import { createFileRoute, useParams } from "@tanstack/react-router";
import { FileTree } from "@/components/file-tree";

export const Route = createFileRoute("/_authenticated/workspace/$workspaceId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { workspaceId } = useParams({ from: Route.id });

	return (
		<div className="flex h-full flex-1 flex-row">
			<FileTree workspaceId={workspaceId} />
			<div>dashboard</div>
		</div>
	);
}
