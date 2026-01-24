import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { usePlayerStore } from "../store/playerStore";
import { audioService } from "../services/audioService";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";

// ✅ SVG icons (no fonts)
import { PlayIcon, PauseIcon, NextIcon, PrevIcon } from "../icons/PlayerIcons";

export function MiniPlayer() {
    const nav = useNavigation<any>();
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    const activeSong = usePlayerStore((s) => s.activeSong);
    const isPlaying = usePlayerStore((s) => s.isPlaying);

    if (!activeSong) return null;

    const img =
        activeSong.image?.find((x: any) => x.quality?.includes("150"))?.link ??
        activeSong.image?.find((x: any) => x.quality?.includes("150"))?.url ??
        activeSong.image?.[activeSong.image.length - 1]?.link ??
        activeSong.image?.[activeSong.image.length - 1]?.url ??
        null;

    return (
        <Pressable
            style={[
                styles.container,
                { borderTopColor: c.border, backgroundColor: c.card },
            ]}
            onPress={() => nav.navigate("Player")}
        >
            {img ? (
                <Image source={{ uri: img }} style={styles.img} />
            ) : (
                <View style={[styles.img, { backgroundColor: c.border }]} />
            )}

            <View style={styles.info}>
                <Text numberOfLines={1} style={[styles.title, { color: c.text }]}>
                    {activeSong.name}
                </Text>
                <Text numberOfLines={1} style={[styles.artist, { color: c.sub }]}>
                    {activeSong.primaryArtists ??
                        activeSong.artists?.primary?.map((a: any) => a.name).join(", ")}
                </Text>
            </View>

            <View style={styles.controls}>
                <Pressable
                    onPress={(e) => {
                        e.stopPropagation();
                        audioService.prev();
                    }}
                    style={styles.controlBtn}
                    hitSlop={10}
                >
                    <PrevIcon size={20} color={c.text} />
                </Pressable>

                <Pressable
                    onPress={(e) => {
                        e.stopPropagation();
                        audioService.togglePlayPause();
                    }}
                    style={[styles.controlBtn, styles.playBtn]}
                    hitSlop={10}
                >
                    {isPlaying ? (
                        <PauseIcon size={20} color={c.text} />
                    ) : (
                        <PlayIcon size={20} color={c.text} />
                    )}
                </Pressable>

                <Pressable
                    onPress={(e) => {
                        e.stopPropagation();
                        audioService.next();
                    }}
                    style={styles.controlBtn}
                    hitSlop={10}
                >
                    <NextIcon size={20} color={c.text} />
                </Pressable>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 66,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        height: 70,
        borderTopWidth: 1,
    },
    img: { width: 50, height: 50, borderRadius: 6, marginRight: 12 },
    info: { flex: 1, marginRight: 8 },
    title: { fontSize: 14, fontWeight: "700" },
    artist: { fontSize: 12, marginTop: 2 },
    controls: { flexDirection: "row", alignItems: "center" },
    controlBtn: { padding: 8 },
    playBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6,
    },
});
