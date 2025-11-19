import { create } from "zustand";

export type AppState = {
	commandMenuOpen: boolean;
};

export const useAppState = create<AppState>((set) => ({
	commandMenuOpen: false,
}));
