import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";

// ✅ SVG icons
import { SearchIcon, SunIcon, MoonIcon } from "../icons/PlayerIcons";

export function TopBar() {
    const nav = useNavigation<any>();
    const mode = useSettingsStore((s) => s.themeMode);
    const toggleTheme = useSettingsStore((s) => s.toggleThemeMode);
    const c = colors[mode];
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: c.card,
                    borderBottomColor: c.border,
                    paddingTop: insets.top,
                    height: insets.top + 56,
                    opacity: 0.96,
                },
            ]}
        >
            <View style={styles.left}>
                <Text style={[styles.logo, { color: c.text }]}>Mume</Text>
            </View>

            <View style={styles.right}>
                <Pressable
                    onPress={() => nav.navigate("Search")}
                    style={styles.iconBtn}
                    hitSlop={10}
                >
                    <SearchIcon size={20} color={c.text} />
                </Pressable>

                <Pressable
                    onPress={toggleTheme}
                    style={styles.iconBtn}
                    hitSlop={10}
                >
                    {mode === "dark" ? (
                        <SunIcon size={20} color={c.text} />
                    ) : (
                        <MoonIcon size={20} color={c.text} />
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        zIndex: 50,
        elevation: 8,
        borderBottomWidth: 1,
        width: "100%",
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    left: { flexDirection: "row", alignItems: "center" },
    logo: { fontSize: 20, fontWeight: "900" },
    right: { flexDirection: "row", alignItems: "center" },
    iconBtn: { padding: 8, marginLeft: 8 },
});
