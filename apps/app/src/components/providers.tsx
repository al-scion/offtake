import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "./ui/toast";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="root">
			<ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
				<TooltipProvider delay={200}>
					<ToastProvider position="top-right">
						{children}
						{/* <TanStackDevtools
							plugins={[
								{
									name: "Tanstack Query",
									render: () => <ReactQueryDevtoolsPanel />,
								},
								{
									name: "Tanstack Router",
									render: () => <TanStackRouterDevtoolsPanel />,
								},
							]}
						/> */}
					</ToastProvider>
				</TooltipProvider>
			</ThemeProvider>
		</div>
	);
};
