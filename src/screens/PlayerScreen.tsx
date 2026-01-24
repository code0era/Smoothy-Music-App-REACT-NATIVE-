import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, Modal, ScrollView, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

import { usePlayerStore } from "../store/playerStore";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";
import { audioService } from "../services/audioService";
import { getLyrics } from "../api/saavn";
import type { Song } from "../api/types";

function pickCover(song: Song) {
    const arr = song.image ?? [];
    return (
        arr.find((x) => x.quality?.includes("500"))?.link ??
        arr.find((x) => x.quality?.includes("500"))?.url ??
        arr[arr.length - 1]?.link ??
        arr[arr.length - 1]?.url ??
        null
    );
}

export function PlayerScreen() {
    const nav = useNavigation<any>();
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    const song = usePlayerStore((s) => s.activeSong);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const pos = usePlayerStore((s) => s.positionMs);
    const dur = usePlayerStore((s) => s.durationMs);

    const shuffle = usePlayerStore((s) => s.shuffle);
    const repeat = usePlayerStore((s) => s.repeat);

    const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
    const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);

    const [lyricsModalVisible, setLyricsModalVisible] = useState(false);
    const [lyrics, setLyrics] = useState<string | null>(null);
    const [lyricsLoading, setLyricsLoading] = useState(false);

    const openLyrics = async () => {
        setLyricsModalVisible(true);
        if (lyrics !== null) return; // Already loaded

        if (!song) return;
        setLyricsLoading(true);
        const artist = song.primaryArtists ?? song.artists?.primary?.map((a) => a.name).join(", ") ?? "Unknown";
        const fetched = await getLyrics(song.name, artist);
        setLyrics(fetched ?? "Lyrics not available for this song.");
        setLyricsLoading(false);
    };

    if (!song) {
        return (
            <View style={[styles.center, { backgroundColor: c.bg }]}>
                <Text style={{ color: c.sub }}>No song selected.</Text>
                <Pressable onPress={() => nav.goBack()} style={{ marginTop: 10 }}>
                    <Text style={{ color: c.green, fontWeight: "900" }}>Go back</Text>
                </Pressable>
            </View>
        );
    }

    const cover = pickCover(song);
    const artist =
        song.primaryArtists ?? song.artists?.primary?.map((a) => a.name).join(", ") ?? "";

    return (
        <View style={[styles.wrap, { backgroundColor: c.bg }]}>
            {/* top bar */}
            <View style={styles.top}>
                <Pressable onPress={() => nav.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={c.text} />
                </Pressable>
                <Pressable onPress={() => { }}>
                    <Ionicons name="ellipsis-horizontal" size={22} color={c.text} />
                </Pressable>
            </View>

            {/* cover */}
            <View style={styles.coverWrap}>
                {cover ? (
                    <Image source={{ uri: cover }} style={styles.cover} />
                ) : (
                    <View style={[styles.cover, { backgroundColor: c.border }]} />
                )}
            </View>

            {/* title */}
            <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
                {song.name}
            </Text>
            <Text style={[styles.artist, { color: c.sub }]} numberOfLines={1}>
                {artist}
            </Text>

            <View style={[styles.hr, { backgroundColor: c.border }]} />

            {/* slider */}
            <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={dur || 1}
                value={pos}
                onSlidingComplete={(v) => audioService.seekTo(v)}
                minimumTrackTintColor={c.green}
                maximumTrackTintColor={c.border}
                thumbTintColor={c.green}
            />
            <View style={styles.timeRow}>
                <Text style={{ color: c.sub, fontWeight: "700" }}>{fmt(pos)}</Text>
                <Text style={{ color: c.sub, fontWeight: "700" }}>{fmt(dur)}</Text>
            </View>

            {/* controls */}
            <View style={styles.controls}>
                <Pressable onPress={() => audioService.prev()}>
                    <Ionicons name="play-skip-back" size={30} color={c.text} />
                </Pressable>

                <Pressable
                    onPress={() => audioService.togglePlayPause()}
                    style={[styles.playBtn, { backgroundColor: c.green }]}
                >
                    <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={34}
                        color={"white"}
                        style={{ marginLeft: isPlaying ? 0 : 3 }}
                    />
                </Pressable>

                <Pressable onPress={() => audioService.next()}>
                    <Ionicons name="play-skip-forward" size={30} color={c.text} />
                </Pressable>
            </View>

            {/* bottom actions */}
            <View style={styles.actions}>
                <Pressable onPress={toggleShuffle}>
                    <Ionicons name="shuffle" size={22} color={shuffle ? c.green : c.sub} />
                </Pressable>

                <Pressable onPress={cycleRepeat}>
                    <Ionicons name="repeat" size={22} color={repeat === "off" ? c.sub : c.green} />
                </Pressable>

                <Pressable onPress={() => nav.navigate("Queue")}>
                    <Ionicons name="list" size={22} color={c.sub} />
                </Pressable>

                <Pressable onPress={openLyrics}>
                    <Ionicons name="musical-notes" size={22} color={c.sub} />
                </Pressable>
            </View>

            <View style={styles.lyrics}>
                <Ionicons name="chevron-up" size={18} color={c.sub} />
                <Text style={{ color: c.sub, fontWeight: "900", fontSize: 18, marginTop: 8 }}>
                    Lyrics
                </Text>
            </View>

            {/* Lyrics Modal */}
            <Modal
                visible={lyricsModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setLyricsModalVisible(false)}
            >
                <View style={[styles.lyricsModal, { backgroundColor: c.bg }]}>
                    <View style={[styles.lyricsHeader, { borderBottomColor: c.border }]}>
                        <Pressable onPress={() => setLyricsModalVisible(false)}>
                            <Ionicons name="chevron-down" size={28} color={c.text} />
                        </Pressable>
                        <Text style={[styles.lyricsTitle, { color: c.text }]}>Lyrics</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    {lyricsLoading ? (
                        <View style={[styles.center, { flex: 1 }]}>
                            <ActivityIndicator size="large" color={c.green} />
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 30 }}>
                            <Text style={[styles.lyricsText, { color: c.text }]}>
                                {lyrics || "Lyrics not available."}
                            </Text>
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </View>
    );
}

function fmt(ms: number) {
    const s = Math.floor((ms || 0) / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
}

const styles = StyleSheet.create({
    wrap: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },

    top: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10,
    },

    coverWrap: { alignItems: "center", marginTop: 6 },
    cover: { width: "86%", aspectRatio: 1, borderRadius: 28 },

    title: { marginTop: 18, fontSize: 34, fontWeight: "900", textAlign: "center" },
    artist: { marginTop: 6, fontSize: 18, fontWeight: "700", textAlign: "center" },

    hr: { height: 1, marginTop: 16, marginBottom: 14 },

    timeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: -4 },

    controls: {
        marginTop: 22,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
    },
    playBtn: {
        width: 88,
        height: 88,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },

    actions: {
        marginTop: 26,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

    lyrics: { marginTop: 34, alignItems: "center" },

    lyricsModal: { flex: 1 },
    lyricsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    lyricsTitle: { fontSize: 18, fontWeight: "900" },
    lyricsText: { fontSize: 16, lineHeight: 26, fontWeight: "500" },
});
