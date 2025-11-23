import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/voice")({
	component: RouteComponent,
});

function RouteComponent() {
	const audio = new RTCPeerConnection();

	return <div>Hello "/_authenticated/voice"!</div>;
}
