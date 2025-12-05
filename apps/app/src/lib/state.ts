import { create } from "zustand";

export type AppState = {
	commandMenuOpen: boolean;
	chatPanelOpen: boolean;
	chatId: string;
};

export const useAppState = create<AppState>((set) => ({
	commandMenuOpen: false,
	chatPanelOpen: false,
	chatId: crypto.randomUUID(),
}));
