import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { SidebarProvider } from "./ui/sidebar";
import { ToastProvider } from "./ui/toast";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="root">
			<ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
				<TooltipProvider delay={200}>
					<ToastProvider position="top-right">
						{/* <SidebarProvider style={{ "--sidebar-width": "14rem" } as React.CSSProperties}> */}
							{children}
						{/* </SidebarProvider> */}
					</ToastProvider>
				</TooltipProvider>
			</ThemeProvider>
		</div>
	);
};
