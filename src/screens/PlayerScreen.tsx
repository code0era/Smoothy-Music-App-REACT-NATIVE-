import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Modal,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

import { usePlayerStore } from "../store/playerStore";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";
import { audioService } from "../services/audioService";
import { getLyrics } from "../api/saavn";
import type { Song } from "../api/types";

import {
    BackIcon,
    MoreIcon,
    PlayIcon,
    PauseIcon,
    PrevIcon,
    NextIcon,
    ShuffleIcon,
    RepeatIcon,
    ListIcon,
    MusicIcon,
    ChevronUp,
    ChevronDown,
} from "../icons/PlayerIcons";

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
        if (lyrics !== null || !song) return;

        setLyricsLoading(true);
        const artist =
            song.primaryArtists ??
            song.artists?.primary?.map((a) => a.name).join(", ") ??
            "Unknown";
        const fetched = await getLyrics(song.name, artist);
        setLyrics(fetched ?? "Lyrics not available.");
        setLyricsLoading(false);
    };

    if (!song) return null;

    const cover = pickCover(song);
    const artist =
        song.primaryArtists ??
        song.artists?.primary?.map((a) => a.name).join(", ") ??
        "";

    return (
        <View style={[styles.wrap, { backgroundColor: c.bg }]}>
            {/* Top bar */}
            <View style={styles.top}>
                <Pressable onPress={() => nav.goBack()}>
                    <BackIcon color={c.text} />
                </Pressable>
                <MoreIcon color={c.text} />
            </View>

            {/* Cover */}
            <View style={styles.coverWrap}>
                {cover ? (
                    <Image source={{ uri: cover }} style={styles.cover} />
                ) : (
                    <View style={[styles.cover, { backgroundColor: c.border }]} />
                )}
            </View>

            <Text style={[styles.title, { color: c.text }]}>{song.name}</Text>
            <Text style={[styles.artist, { color: c.sub }]}>{artist}</Text>

            <View style={[styles.hr, { backgroundColor: c.border }]} />

            {/* Slider */}
            <Slider
                minimumValue={0}
                maximumValue={dur || 1}
                value={pos}
                onSlidingComplete={(v) => audioService.seekTo(v)}
                minimumTrackTintColor={c.green}
                maximumTrackTintColor={c.border}
                thumbTintColor={c.green}
            />

            <View style={styles.timeRow}>
                <Text style={{ color: c.sub }}>{fmt(pos)}</Text>
                <Text style={{ color: c.sub }}>{fmt(dur)}</Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <Pressable onPress={() => audioService.prev()}>
                    <PrevIcon color={c.text} />
                </Pressable>

                <Pressable
                    onPress={() => audioService.togglePlayPause()}
                    style={[styles.playBtn, { backgroundColor: c.green }]}
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </Pressable>

                <Pressable onPress={() => audioService.next()}>
                    <NextIcon color={c.text} />
                </Pressable>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <Pressable onPress={toggleShuffle}>
                    <ShuffleIcon color={shuffle ? c.green : c.sub} />
                </Pressable>

                <Pressable onPress={cycleRepeat}>
                    <RepeatIcon color={repeat === "off" ? c.sub : c.green} />
                </Pressable>

                <Pressable onPress={() => nav.navigate("Queue")}>
                    <ListIcon color={c.sub} />
                </Pressable>

                <Pressable onPress={openLyrics}>
                    <MusicIcon color={c.sub} />
                </Pressable>
            </View>

            <View style={styles.lyrics}>
                <ChevronUp color={c.sub} />
                <Text style={{ color: c.sub, fontWeight: "900", marginTop: 8 }}>
                    Lyrics
                </Text>
            </View>

            {/* Lyrics Modal */}
            <Modal visible={lyricsModalVisible} animationType="slide">
                <View style={[styles.lyricsModal, { backgroundColor: c.bg }]}>
                    <View style={[styles.lyricsHeader, { borderBottomColor: c.border }]}>
                        <Pressable onPress={() => setLyricsModalVisible(false)}>
                            <ChevronDown color={c.text} />
                        </Pressable>
                        <Text style={[styles.lyricsTitle, { color: c.text }]}>Lyrics</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    {lyricsLoading ? (
                        <ActivityIndicator size="large" color={c.green} />
                    ) : (
                        <ScrollView style={{ padding: 16 }}>
                            <Text style={{ color: c.text, lineHeight: 26 }}>{lyrics}</Text>
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </View>
    );
}

function fmt(ms: number) {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
    wrap: { flex: 1, padding: 16 },
    top: { flexDirection: "row", justifyContent: "space-between" },
    coverWrap: { alignItems: "center", marginVertical: 16 },
    cover: { width: "86%", aspectRatio: 1, borderRadius: 28 },
    title: { fontSize: 34, fontWeight: "900", textAlign: "center" },
    artist: { fontSize: 18, textAlign: "center", marginTop: 6 },
    hr: { height: 1, marginVertical: 14 },
    timeRow: { flexDirection: "row", justifyContent: "space-between" },
    controls: { flexDirection: "row", justifyContent: "center", gap: 28, marginTop: 24 },
    playBtn: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center" },
    actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 26 },
    lyrics: { alignItems: "center", marginTop: 32 },
    lyricsModal: { flex: 1 },
    lyricsHeader: { flexDirection: "row", justifyContent: "space-between", padding: 16, borderBottomWidth: 1 },
    lyricsTitle: { fontSize: 18, fontWeight: "900" },
});
