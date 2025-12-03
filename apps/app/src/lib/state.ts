import { create } from "zustand";

export type AppState = {
	commandMenuOpen: boolean;
	chatPanelOpen: boolean;
};

export const useAppState = create<AppState>((set) => ({
	commandMenuOpen: false,
	chatPanelOpen: false,
}));
