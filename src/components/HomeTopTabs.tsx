import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";

export type HomeTab = "Suggested" | "Songs" | "Artists" | "Albums";

export function HomeTopTabs({
    value,
    onChange,
}: {
    value: HomeTab;
    onChange: (t: HomeTab) => void;
}) {
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    const tabs: HomeTab[] = ["Suggested", "Songs", "Artists", "Albums"];

    return (
        <View style={styles.wrap}>
            {tabs.map((t) => {
                const active = t === value;
                return (
                    <Pressable key={t} onPress={() => onChange(t)} style={styles.tab}>
                        <Text style={[styles.txt, { color: active ? c.green : c.sub }]}>
                            {t}
                        </Text>
                        <View
                            style={[
                                styles.underline,
                                { backgroundColor: active ? c.green : "transparent" },
                            ]}
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        gap: 26,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        alignItems: "flex-end",
    },
    tab: { paddingBottom: 8 },
    txt: { fontSize: 16, fontWeight: "700" },
    underline: { height: 3, borderRadius: 99, marginTop: 10 },
});
