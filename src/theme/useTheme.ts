import { DefaultTheme, DarkTheme, Theme } from "@react-navigation/native";
import type { ThemeMode } from "../store/settingsStore";
import { colors } from "./colors";

export function useTheme(mode: ThemeMode): Theme {
    const c = colors[mode];
    const base = mode === "dark" ? DarkTheme : DefaultTheme;

    return {
        ...base,
        colors: {
            ...base.colors,
            background: c.bg,
            card: c.card,
            text: c.text,
            border: c.border,
            primary: c.green,
        },
    };
}
