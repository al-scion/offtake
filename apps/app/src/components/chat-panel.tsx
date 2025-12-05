import { Chat, useChat } from "@ai-sdk/react";
import type { DataPart, MessageType, Metadata, Tools } from "@apps/worker/src/types";
import { Document } from "@tiptap/extension-document";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Heading } from "@tiptap/extension-heading";
import { Mention, type MentionNodeAttrs } from "@tiptap/extension-mention";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, type Range, useEditor, useEditorState } from "@tiptap/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, AtSign, Paperclip, PenSquare, XIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { env } from "@/lib/env";
import { useAppState } from "@/lib/state";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Card, CardContent, CardContentItem } from "./ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

const mentionItems = [
	{ id: "123", label: "Item 1" },
	{ id: "456", label: "Item 2" },
];

export function ChatPanel({ children }: { children: React.ReactNode }) {
	const [chatPanelOpen, setChatPanelOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [handleActive, setHandleActive] = useState(false);

	const panelRef = useRef<ImperativePanelHandle>(null);
	const panelContentRef = useRef<HTMLDivElement>(null);
	const [panelContentWidth, setPanelContentWidth] = useState(400);

	const [query, setQuery] = useState<string | null>(null);
	const [queryRange, setQueryRange] = useState<Range | null>(null);
	const commandInputRef = useRef<HTMLInputElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { chatId } = useAppState();

	const chatInstance = useMemo(
		() =>
			new Chat<MessageType>({
				id: chatId,
				messages: [], // TODO: Fetch messages from the database
				transport: new DefaultChatTransport({
					api: `${env.VITE_WORKER_URL}/api/chat`,
				}),
			}),
		[chatId]
	);

	const chat = useChat<MessageType>({ chat: chatInstance });

	const handleSendMessage = () => {
		chat.sendMessage({ text: editor.getText() });
		editor.commands.clearContent();
	};

	const newChat = () => useAppState.setState({ chatId: crypto.randomUUID() });

	const editor = useEditor(
		{
			extensions: [
				Document,
				Heading,
				Paragraph,
				Text,
				HardBreak,
				Placeholder,
				Mention.configure({
					deleteTriggerWithBackspace: true,
					suggestions: [
						{
							char: "@",
							allowSpaces: false,
							// command: (props) => {},
							render: () => ({
								onStart: (props) => {
									setQuery(props.query);
									setQueryRange(props.range);
								},
								onUpdate: (props) => {
									setQuery(props.query);
									setQueryRange(props.range);
								},
								onExit: (props) => {
									setQuery(null);
									setQueryRange(props.range);
								},
								onKeyDown: ({ event, range, view }) => {
									if (event.key === "ArrowDown" || event.key === "ArrowUp") {
										event.preventDefault();
										event.stopPropagation();
										const newEvent = new KeyboardEvent(event.type, {
											key: event.key,
											code: event.code,
											bubbles: true,
											cancelable: true,
										});
										commandInputRef.current?.dispatchEvent(newEvent);
										return true;
									}
									if (event.key === "Enter" || event.key === "Tab") {
										event.preventDefault();
										event.stopPropagation();
										const newEvent = new KeyboardEvent(event.type, {
											key: "Enter",
											code: "Enter",
											bubbles: true,
											cancelable: true,
										});
										commandInputRef.current?.dispatchEvent(newEvent);
										return true;
									}
									return false;
								},
							}),
						},
					],
				}),
			],
			editorProps: {
				handleKeyDown: (view, event) => {
					if (event.key === "Enter" && event.shiftKey === false && query === null) {
						handleSendMessage();
						return true;
					}
					return false;
				},
			},
		},
		[] // Insert dep array here
	);
	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			isEmpty: editor.isEmpty,
			isFocused: editor.isFocused,
			selection: editor.state.selection,
		}),
	});

	const handleSelectMention = (id: string, label: string) => {
		editor
			.chain()
			.insertContentAt(queryRange!, [
				{ type: "mention", attrs: { id, label } satisfies MentionNodeAttrs },
				{ type: "text", text: " " },
			])
			.focus()
			.run();
	};

	const togglePanel = () => {
		chatPanelOpen && setPanelContentWidth(panelContentRef.current?.offsetWidth ?? 400);
		setHandleActive(true);
		if (chatPanelOpen) {
			panelRef.current?.collapse();
		} else {
			panelRef.current?.expand();
			editor.commands.focus();
		}
		setTimeout(() => setHandleActive(false), 250);
	};

	useHotkeys("meta+j", togglePanel, {
		enableOnContentEditable: true,
		enableOnFormTags: true,
	});

	return (
		<ResizablePanelGroup autoSaveId="chat-panel-state" direction="horizontal">
			<ResizablePanel className="flex">{children}</ResizablePanel>
			<ResizableHandle className={cn("w-[0.5px]", isDragging && "ring-1 ring-border")} onDragging={setIsDragging} />
			<ResizablePanel
				className={cn("", handleActive && "transition-all duration-250")}
				collapsible
				defaultSize={30}
				maxSize={50}
				minSize={20}
				onCollapse={() => setChatPanelOpen(false)}
				onExpand={() => setChatPanelOpen(true)}
				ref={panelRef}
			>
				<div
					className="flex h-full flex-col overflow-hidden"
					ref={panelContentRef}
					style={{ minWidth: handleActive ? panelContentWidth : 0 }}
				>
					<div className="flex h-12 flex-row items-center border-b p-2">
						<span>Chat</span>
						<div className="ml-auto flex flex-row">
							<TooltipButton onClick={newChat} shortcutKeys={["⌘", "⇧", "O"]} tooltip="New chat" variant="ghost">
								<PenSquare />
							</TooltipButton>
							<TooltipButton onClick={togglePanel} shortcutKeys={["⌘", "J"]} tooltip="Close chat" variant="ghost">
								<XIcon />
							</TooltipButton>
						</div>
					</div>
					<div className="flex flex-1">Content</div>
					{/* <span>{JSON.stringify(chat.status)}</span>
					<span>{JSON.stringify(chat.messages)}</span>
					<span>{JSON.stringify(chatId)}</span> */}
					<Card className="relative m-2 mt-0">
						<CardContent className="p-0">
							<CardContentItem className="flex-col items-start">
								<EditorContent className="w-full flex-1" editor={editor} />
								<div className="flex w-full flex-row">
									<div className="flex flex-row gap-1">
										<TooltipButton onClick={fileInputRef.current?.click} size="icon" tooltip="Files" variant="ghost">
											<input className="hidden" multiple onChange={() => {}} ref={fileInputRef} type="file" />
											<Paperclip />
										</TooltipButton>
										<TooltipButton
											onClick={() => editor.chain().insertContent("@").focus().run()}
											size="icon"
											tooltip="Context"
											variant="ghost"
										>
											<AtSign />
										</TooltipButton>
									</div>
									<div className="ml-auto">
										<TooltipButton
											className="rounded-full"
											disabled={editorState.isEmpty}
											onClick={handleSendMessage}
											size="icon"
										>
											<ArrowUp />
										</TooltipButton>
									</div>
								</div>
							</CardContentItem>
						</CardContent>
						<Command
							className={cn(
								"-translate-x-1/2 absolute bottom-[calc(100%+4px)] left-1/2 h-fit w-[calc(100%-4px)] rounded-lg border",
								query === null && "hidden"
							)}
							filter={(value, search, keywords) =>
								keywords?.join(" ").toLowerCase().includes(search.toLowerCase()) ? 1 : 0
							}
							loop
						>
							<CommandInput ref={commandInputRef} value={query || ""} wrapperClassName="hidden" />
							<CommandList>
								<CommandEmpty>No results</CommandEmpty>
								<CommandGroup>
									{mentionItems.map((item, index) => (
										<CommandItem
											key={index}
											keywords={[item.label]}
											onSelect={(value) => handleSelectMention(value, item.label)}
											value={item.id}
										>
											<span className="truncate">{item.label}</span>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</Card>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
