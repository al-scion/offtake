import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";

export const Route = createFileRoute("/auth/callback")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		// Do some stuff with the auth data

		throw redirect({ to: "/" });
	},
});

function RouteComponent() {
	return <div>Callback Loading...</div>;
}
