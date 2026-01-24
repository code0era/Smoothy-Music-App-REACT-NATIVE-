import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";
import type { Song } from "../api/types";

function pickImg(song: Song) {
    const arr = song.image ?? [];
    const i150 =
        arr.find((x) => x.quality?.includes("150"))?.link ??
        arr.find((x) => x.quality?.includes("150"))?.url;
    const last = arr[arr.length - 1]?.link ?? arr[arr.length - 1]?.url;
    return i150 ?? last ?? null;
}

export function MediaCard({
    song,
    onPress,
    width = 160,
}: {
    song: Song;
    onPress: () => void;
    width?: number;
}) {
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];
    const img = pickImg(song);

    return (
        <Pressable onPress={onPress} style={[styles.card, { width }]}>
            {img ? (
                <Image source={{ uri: img }} style={styles.img} />
            ) : (
                <View style={[styles.img, { backgroundColor: c.border }]} />
            )}
            <Text numberOfLines={2} style={[styles.title, { color: c.text }]}>
                {song.name}
            </Text>
            <Text numberOfLines={1} style={[styles.sub, { color: c.sub }]}>
                {song.primaryArtists ?? song.artists?.primary?.map((a) => a.name).join(", ") ?? ""}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: { marginRight: 14 },
    img: { width: "100%", aspectRatio: 1, borderRadius: 18 },
    title: { marginTop: 10, fontSize: 16, fontWeight: "800" },
    sub: { marginTop: 4, fontSize: 12, fontWeight: "600" },
});
