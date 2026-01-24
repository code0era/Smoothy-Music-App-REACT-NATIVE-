import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";

export function SectionHeader({ title }: { title: string }) {
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    return (
        <View style={styles.wrap}>
            <Text style={[styles.txt, { color: c.text }]}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 },
    txt: { fontSize: 18, fontWeight: "700" },
});
