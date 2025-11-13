import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@workos-inc/authkit-react";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const auth = useAuth()

	return (
		<>
		  <div>Root</div>
			<Outlet />
		</>
	);
}
