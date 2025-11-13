// import { ClerkProvider } from "@clerk/clerk-react";
// import { ConvexQueryClient } from "@convex-dev/react-query";
import { AuthKitProvider, useAuth } from '@workos-inc/authkit-react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
// import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { env } from "@/lib/env";
import { routeTree } from "./routeTree.gen";
import "./index.css";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// const convexReactClient = new ConvexReactClient(env.VITE_CONVEX_URL);
// const convexQueryClient = new ConvexQueryClient(convexReactClient);
const queryClient = new QueryClient({
	defaultOptions: {
		// queries: {
		// 	queryKeyHashFn: convexQueryClient.hashFn(),
		// 	queryFn: convexQueryClient.queryFn(),
		// },
	},
});
// convexQueryClient.connect(queryClient);

const router = createRouter({
	routeTree,
	defaultErrorComponent: (e) => <div>Error: {e.error.message}</div>,
	defaultNotFoundComponent: () => <div>Not found here</div>,
	context: {
		queryClient,
		// auth: undefined!,
		// convexReactClient,
		// convexQueryClient,
	},
	Wrap: ({ children }) => (
		// <ConvexProvider client={convexReactClient}>
		<AuthKitProvider clientId={env.VITE_WORKOS_CLIENT_ID} redirectUri={`${window.location.origin}/auth/callback`}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</AuthKitProvider>
		// {/* </ConvexProvider> */}
	),
	// InnerWrap: ({children}) => (children)
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
