import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Text, Pressable, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { searchAlbums, searchArtists, searchSongs } from "../api/saavn";
import { SongRow } from "../components/SongRow";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";
import { usePlayerStore } from "../store/playerStore";
import { audioService } from "../services/audioService";

export function SearchScreen() {
    const nav = useNavigation<any>();
    const mode = useSettingsStore((s) => s.themeMode);
    const toggleTheme = useSettingsStore((s) => s.toggleThemeMode);
    const c = colors[mode];

    const setQueueAndPlay = usePlayerStore((s) => s.setQueueAndPlay);

    const [tab, setTab] = useState<"music" | "podcasts">("music");
    const [q, setQ] = useState("");
    const [songs, setSongs] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [artists, setArtists] = useState<any[]>([]);

    const debounced = useDebounce(q.trim(), 350);

    useEffect(() => {
        let alive = true;
        (async () => {
            if (!debounced || tab !== "music") {
                setSongs([]);
                setAlbums([]);
                setArtists([]);
                return;
            }
            const [s, a, r] = await Promise.all([
                searchSongs(debounced, 1, 20),
                searchAlbums(debounced, 1, 10),
                searchArtists(debounced, 1, 10),
            ]);
            if (!alive) return;
            setSongs(s.results);
            setAlbums(a);
            setArtists(r);
        })();
        return () => {
            alive = false;
        };
    }, [debounced, tab]);

    return (
        <View style={[styles.wrap, { backgroundColor: c.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.logoText, { color: c.text }]}>SMOOTHY</Text>
                <Pressable onPress={toggleTheme}>
                    <Ionicons
                        name={mode === "dark" ? "sunny-outline" : "moon-outline"}
                        size={22}
                        color={c.text}
                    />
                </Pressable>
            </View>

            <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Search songs, artists, albums"
                placeholderTextColor={c.sub}
                style={[styles.input, { backgroundColor: c.card, color: c.text, borderColor: c.border }]}
            />

            <View style={styles.tabs}>
                <Chip label="Music" active={tab === "music"} onPress={() => setTab("music")} />
                <Chip label="Podcasts" active={tab === "podcasts"} onPress={() => setTab("podcasts")} />
            </View>

            {tab === "podcasts" ? (
                <Text style={{ color: c.sub, padding: 16 }}>
                    Podcasts tab is visual-only for this assignment.
                </Text>
            ) : (
                <FlatList
                    data={songs}
                    keyExtractor={(x) => x.id}
                    renderItem={({ item, index }) => (
                        <SongRow
                            song={item}
                            onPress={async () => {
                                setQueueAndPlay(songs as any, index);
                                const s = usePlayerStore.getState().activeSong;
                                if (s) await audioService.loadAndPlay(s);
                                nav.navigate("Player");
                            }}
                            right={
                                <Pressable
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        nav.navigate("Album", { albumId: item.album?.id, title: item.album?.name });
                                    }}
                                >
                                    <Text style={{ color: c.green, fontWeight: "900" }}>Album</Text>
                                </Pressable>
                            }
                        />
                    )}
                    ListHeaderComponent={
                        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                            <Text style={{ color: c.sub }}>
                                Albums & Artists are fetched (expand UI later if you want).
                            </Text>
                            {albums.length > 0 && (
                                <Text style={{ color: c.text, marginTop: 10, fontWeight: "900" }}>
                                    Albums: {albums.slice(0, 4).map((x: any) => x.name).join(" • ")}
                                </Text>
                            )}
                            {artists.length > 0 && (
                                <Text style={{ color: c.text, marginTop: 6, fontWeight: "900" }}>
                                    Artists: {artists.slice(0, 4).map((x: any) => x.name).join(" • ")}
                                </Text>
                            )}
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 110 }}
                />
            )}
        </View>
    );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.chip,
                { opacity: active ? 1 : 0.55, backgroundColor: active ? "#1DB954" : "#E6E6E6" },
            ]}
        >
            <Text style={{ fontWeight: "900", color: active ? "white" : "black" }}>{label}</Text>
        </Pressable>
    );
}

function useDebounce<T>(value: T, delay: number) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}

const styles = StyleSheet.create({
    wrap: { flex: 1 },

    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoText: { fontSize: 26, fontWeight: "900" },

    input: { margin: 16, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
    tabs: { flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingBottom: 10 },
    chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 },
});
