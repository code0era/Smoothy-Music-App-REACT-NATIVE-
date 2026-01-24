import { create } from "zustand";
import { persistSettings } from "../services/storage";

export type ThemeMode = "dark" | "light";
export type AudioQuality = "low" | "medium" | "high";

type SettingsState = {
    themeMode: ThemeMode;
    quality: AudioQuality;

    setThemeMode: (m: ThemeMode) => void;
    toggleThemeMode: () => void;

    setQuality: (q: AudioQuality) => void;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
    themeMode: "dark",
    quality: "high",

    setThemeMode: (themeMode) => {
        set({ themeMode });
        persistSettings();
    },

    toggleThemeMode: () => {
        const cur = get().themeMode;
        const next: ThemeMode = cur === "dark" ? "light" : "dark";
        set({ themeMode: next });
        persistSettings();
    },

    setQuality: (quality) => {
        set({ quality });
        persistSettings();
    },
}));
