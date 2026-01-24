import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";

// ✅ SVG icons (NO expo-font, NO vector-icons)
import { SunIcon, MoonIcon } from "../icons/PlayerIcons";

export function SettingsScreen() {
    const themeMode = useSettingsStore((s) => s.themeMode);
    const quality = useSettingsStore((s) => s.quality);
    const toggleTheme = useSettingsStore((s) => s.toggleThemeMode);
    const setQuality = useSettingsStore((s) => s.setQuality);

    const c = colors[themeMode];

    return (
        <View style={[styles.wrap, { backgroundColor: c.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.logoText, { color: c.text }]}>SMOOTHY</Text>

                <Pressable onPress={toggleTheme} style={{ padding: 8 }}>
                    {themeMode === "dark" ? (
                        <SunIcon color={c.text} />
                    ) : (
                        <MoonIcon color={c.text} />
                    )}
                </Pressable>
            </View>

            <Text style={[styles.h1, { color: c.text }]}>Settings</Text>

            <Text style={[styles.label, { color: c.sub }]}>Theme</Text>
            <Row>
                <Btn
                    active={themeMode === "dark"}
                    label="Dark"
                    onPress={() => useSettingsStore.getState().setThemeMode("dark")}
                />
                <Btn
                    active={themeMode === "light"}
                    label="Light"
                    onPress={() => useSettingsStore.getState().setThemeMode("light")}
                />
            </Row>

            <Text style={[styles.label, { color: c.sub }]}>
                Audio Quality (bitrate selection)
            </Text>
            <Row>
                <Btn active={quality === "high"} label="High" onPress={() => setQuality("high")} />
                <Btn active={quality === "medium"} label="Medium" onPress={() => setQuality("medium")} />
                <Btn active={quality === "low"} label="Low" onPress={() => setQuality("low")} />
            </Row>

            <Text style={{ color: c.sub, marginTop: 18, fontWeight: "700" }}>
                Quality selects the best matching downloadUrl bitrate from API.
            </Text>
        </View>
    );
}

function Row({ children }: { children: React.ReactNode }) {
    return (
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
            {children}
        </View>
    );
}

function Btn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 14,
                backgroundColor: active ? "#1DB954" : "#E6E6E6",
            }}
        >
            <Text style={{ fontWeight: "900", color: active ? "white" : "black" }}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrap: { flex: 1, padding: 16 },

    header: {
        paddingTop: 6,
        paddingBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoText: { fontSize: 26, fontWeight: "900" },

    h1: { fontSize: 24, fontWeight: "900", marginBottom: 16 },
    label: { fontWeight: "900", marginBottom: 10 },
});
