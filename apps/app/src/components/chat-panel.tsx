import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import type { ImperativePanelGroupHandle, ImperativePanelHandle } from "react-resizable-panels";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

export function ChatPanel({ children }: { children: React.ReactNode }) {
	const [chatPanelOpen, setChatPanelOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [handleActive, setHandleActive] = useState(false);

	const panelRef = useRef<ImperativePanelHandle>(null);
	const panelContentRef = useRef<HTMLDivElement>(null);
	const [panelContentWidth, setPanelContentWidth] = useState(400);

	const togglePanel = () => {
		chatPanelOpen && setPanelContentWidth(panelContentRef.current?.offsetWidth ?? 400);
		setHandleActive(true);
		chatPanelOpen ? panelRef.current?.collapse() : panelRef.current?.expand();
		setTimeout(() => setHandleActive(false), 250);
	};

	useHotkeys("meta+j", () => togglePanel(), {
		enableOnContentEditable: true,
		enableOnFormTags: true,
	});

	return (
		<ResizablePanelGroup autoSaveId="chat-panel-state" direction="horizontal">
			<ResizablePanel className="flex">{children}</ResizablePanel>
			<ResizableHandle className={cn("w-[0.5px]", isDragging && "ring-1 ring-border")} onDragging={setIsDragging} />
			<ResizablePanel
				className={cn(handleActive && "transition-all duration-250")}
				collapsible
				defaultSize={30}
				maxSize={50}
				minSize={20}
				onCollapse={() => setChatPanelOpen(false)}
				onExpand={() => setChatPanelOpen(true)}
				ref={panelRef}
			>
				<div
					className="overflow-hidden"
					ref={panelContentRef}
					style={{ minWidth: handleActive ? panelContentWidth : 0 }}
				>
					<div className="flex h-12 flex-row items-center border-b p-2">
						<span>Chat</span>
					</div>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
