// import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
// import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { env } from "@/lib/env";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { Loader2 } from "lucide-react";

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
		auth: undefined!,
		// convexReactClient,
		// convexQueryClient,
	},
	Wrap: ({ children }) => (
		// <ConvexProvider client={convexReactClient}>
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		// {/* </ConvexProvider> */}
	),
	// InnerWrap: ({children}) => (children)
});

const App = () => {
	const auth = useAuth();

	if (auth.isLoading) {
		return (
			<div className="flex h-screen w-screen items-center justify-center">
				<Loader2 className="animate-spin text-muted-foreground" />
			</div>
		);
	}

	return <RouterProvider context={{ auth }} router={router} />;
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthKitProvider clientId={env.VITE_WORKOS_CLIENT_ID} redirectUri={env.VITE_WORKOS_REDIRECT_URI}>
			<App />
		</AuthKitProvider>
	</StrictMode>
);
