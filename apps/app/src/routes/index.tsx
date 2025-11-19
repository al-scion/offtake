import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const auth = useAuth();

	return (
		<>
			<div>Root</div>
			<Button onClick={() => auth.signIn()}>Sign in</Button>
			<Outlet />
		</>
	);
}
