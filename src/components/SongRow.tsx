import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import type { Song } from "../api/types";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";

function pickImg(song: Song) {
    const arr = song.image ?? [];
    const best =
        arr.find((x) => x.quality?.includes("150"))?.link ??
        arr.find((x) => x.quality?.includes("150"))?.url ??
        arr.find((x) => x.quality?.includes("50"))?.link ??
        arr.find((x) => x.quality?.includes("50"))?.url ??
        arr[arr.length - 1]?.link ??
        arr[arr.length - 1]?.url ??
        null;
    return best;
}

export function SongRow({
    song,
    onPress,
    right,
}: {
    song: Song;
    onPress: () => void;
    right?: React.ReactNode;
}) {
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];
    const img = pickImg(song);

    const artist =
        song.primaryArtists ??
        song.artists?.primary?.map((a) => a.name).join(", ") ??
        "Unknown";

    return (
        <Pressable onPress={onPress} style={[styles.row, { borderColor: c.border }]}>
            {img ? (
                <Image source={{ uri: img }} style={styles.img} />
            ) : (
                <View style={[styles.img, { backgroundColor: c.border }]} />
            )}

            <View style={styles.mid}>
                <Text numberOfLines={1} style={[styles.title, { color: c.text }]}>
                    {song.name}
                </Text>
                <Text numberOfLines={1} style={[styles.sub, { color: c.sub }]}>
                    {artist}
                </Text>
            </View>

            {right}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    img: { width: 52, height: 52, borderRadius: 12, marginRight: 12 },
    mid: { flex: 1 },
    title: { fontSize: 15, fontWeight: "800" },
    sub: { fontSize: 12, marginTop: 3, fontWeight: "600" },
});
