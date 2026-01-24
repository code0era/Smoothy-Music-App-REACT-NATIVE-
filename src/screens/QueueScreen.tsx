import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";

import { usePlayerStore } from "../store/playerStore";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";
import { audioService } from "../services/audioService";

// ✅ SVG icons
import {
    ChevronUpIcon,
    ChevronDownIcon,
    TrashIcon,
} from "../icons/PlayerIcons";

export function QueueScreen() {
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    const queue = usePlayerStore((s) => s.queue);
    const activeId = usePlayerStore((s) => s.activeSong?.id);
    const setActiveIndex = usePlayerStore((s) => s.setActiveIndex);
    const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
    const reorderQueue = usePlayerStore((s) => s.reorderQueue);

    const move = (from: number, to: number) => {
        if (to < 0 || to >= queue.length) return;
        const next = [...queue];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        reorderQueue(next);
    };

    if (queue.length === 0) {
        return (
            <View style={[styles.wrap, { backgroundColor: c.bg }]}>
                <Text style={{ color: c.sub, padding: 16 }}>Queue is empty.</Text>
            </View>
        );
    }

    return (
        <View style={[styles.wrap, { backgroundColor: c.bg }]}>
            <FlatList
                data={queue}
                keyExtractor={(x) => x.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item, index }) => {
                    const isNow = item.id === activeId;

                    return (
                        <Pressable
                            onPress={async () => {
                                setActiveIndex(index);
                                const s = usePlayerStore.getState().activeSong;
                                if (s) await audioService.loadAndPlay(s);
                            }}
                            style={[styles.row, { borderColor: c.border }]}
                        >
                            <View style={{ flex: 1 }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: isNow ? c.green : c.text,
                                        fontWeight: "800",
                                    }}
                                >
                                    {item.name}
                                </Text>
                                <Text
                                    numberOfLines={1}
                                    style={{ color: c.sub, marginTop: 2, fontSize: 12 }}
                                >
                                    {item.primaryArtists ?? " "}
                                </Text>
                            </View>

                            <View style={styles.btns}>
                                <Pressable onPress={() => move(index, index - 1)} style={styles.iconBtn}>
                                    <ChevronUpIcon color={c.text} />
                                </Pressable>

                                <Pressable onPress={() => move(index, index + 1)} style={styles.iconBtn}>
                                    <ChevronDownIcon color={c.text} />
                                </Pressable>

                                <Pressable onPress={() => removeFromQueue(index)} style={styles.iconBtn}>
                                    <TrashIcon color={c.sub} />
                                </Pressable>
                            </View>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { flex: 1 },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    btns: { flexDirection: "row", alignItems: "center", gap: 8 },
    iconBtn: { padding: 8 },
});
