import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    ActivityIndicator,
    ScrollView,
    Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { searchSongs, searchArtists, searchAlbums } from "../api/saavn";
import type { Song } from "../api/types";

import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";

import { usePlayerStore } from "../store/playerStore";
import { audioService } from "../services/audioService";

import { HomeTopTabs, HomeTab } from "../components/HomeTopTabs";
import { MediaCard } from "../components/MediaCard";
import { ArtistCircle } from "../components/ArtistCircle";

export function HomeScreen() {
    const nav = useNavigation<any>();
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    const setQueueAndPlay = usePlayerStore((s) => s.setQueueAndPlay);
    const recentlyPlayed = usePlayerStore((s) => s.recentlyPlayed);

    const [tab, setTab] = useState<HomeTab>("Suggested");
    const [loading, setLoading] = useState(true);

    // Suggested (songs) for cards
    const [suggested, setSuggested] = useState<Song[]>([]);
    // Artists + Albums lists (for tabs)
    const [artists, setArtists] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [songsList, setSongsList] = useState<Song[]>([]);

    async function load() {
        setLoading(true);

        // Use real API (no mock)
        const [sug, s1, a1, al1] = await Promise.all([
            searchSongs("trending", 1, 18),
            searchSongs("arijit", 1, 30),
            searchArtists("weeknd", 1, 12),
            searchAlbums("top", 1, 12),
        ]);

        setSuggested(sug.results);
        setSongsList(s1.results);
        setArtists(a1);
        setAlbums(al1);

        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    const mostPlayed = useMemo(() => {
        // Simple “Most Played” = fallback to suggested if not enough recently played
        const rp = recentlyPlayed ?? [];
        if (rp.length >= 6) return rp.slice(0, 12);
        return suggested.slice(0, 12);
    }, [recentlyPlayed, suggested]);

    const playFromList = async (list: Song[], index: number) => {
        setQueueAndPlay(list, index);
        const s = usePlayerStore.getState().activeSong;
        if (s) await audioService.loadAndPlay(s);
        nav.navigate("Player");
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: c.bg }]}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: c.bg }}>
            {/* Header like screenshot: logo + title + search icon */}
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="musical-notes" size={22} color={c.green} />
                    <Text style={[styles.logoText, { color: c.text }]}>Smoothy</Text>
                </View>

                <Pressable onPress={() => nav.navigate("Search")}>
                    <Ionicons name="search" size={22} color={c.text} />
                </Pressable>
            </View>

            {/* Top segmented tabs */}
            <HomeTopTabs value={tab} onChange={setTab} />

            <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
                {tab === "Suggested" && (
                    <>
                        {/* Recently Played */}
                        <SectionTitle title="Recently Played" onSeeAll={() => nav.navigate("Queue")} />
                        <FlatList
                            data={(recentlyPlayed?.length ? recentlyPlayed : suggested).slice(0, 10)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(x) => x.id}
                            contentContainerStyle={styles.hList}
                            renderItem={({ item, index }) => (
                                <MediaCard song={item} onPress={() => playFromList((recentlyPlayed?.length ? recentlyPlayed : suggested) as Song[], index)} />
                            )}
                        />

                        {/* Artists */}
                        <SectionTitle title="Artists" onSeeAll={() => nav.navigate("Search")} />
                        <FlatList
                            data={artists}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(x, i) => String(x?.id ?? i)}
                            contentContainerStyle={styles.hList}
                            renderItem={({ item }) => {
                                const img =
                                    item?.image?.[2]?.link ??
                                    item?.image?.[2]?.url ??
                                    item?.image?.[1]?.link ??
                                    item?.image?.[1]?.url ??
                                    item?.image?.[0]?.link ??
                                    item?.image?.[0]?.url ??
                                    null;
                                return (
                                    <ArtistCircle
                                        name={item?.name ?? "Artist"}
                                        imageUrl={img}
                                        onPress={() => nav.navigate("Artist", { artistId: item?.id, name: item?.name })}
                                    />
                                );
                            }}
                        />

                        {/* Most Played */}
                        <SectionTitle title="Most Played" onSeeAll={() => nav.navigate("Search")} />
                        <FlatList
                            data={mostPlayed}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(x) => x.id}
                            contentContainerStyle={styles.hList}
                            renderItem={({ item, index }) => (
                                <MediaCard song={item} onPress={() => playFromList(mostPlayed, index)} />
                            )}
                        />
                    </>
                )}

                {tab === "Songs" && (
                    <ListBlock
                        title="Songs"
                        data={songsList}
                        onPress={(list, index) => playFromList(list, index)}
                    />
                )}

                {tab === "Artists" && (
                    <View style={{ paddingTop: 6 }}>
                        <SectionTitle title="Top Artists" />
                        <FlatList
                            data={artists}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(x, i) => String(x?.id ?? i)}
                            contentContainerStyle={styles.hList}
                            renderItem={({ item }) => {
                                const img =
                                    item?.image?.[2]?.link ??
                                    item?.image?.[2]?.url ??
                                    item?.image?.[1]?.link ??
                                    item?.image?.[1]?.url ??
                                    null;
                                return <ArtistCircle name={item?.name ?? "Artist"} imageUrl={img} />;
                                    return (
                                        <ArtistCircle
                                            name={item?.name ?? "Artist"}
                                            imageUrl={img}
                                            onPress={() => nav.navigate("Artist", { artistId: item?.id, name: item?.name })}
                                        />
                                    );
                            }}
                        />
                    </View>
                )}

                {tab === "Albums" && (
                    <View style={{ paddingTop: 6 }}>
                        <SectionTitle title="Albums" />
                        <FlatList
                            data={albums}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(x, i) => String(x?.id ?? i)}
                            contentContainerStyle={styles.hList}
                            renderItem={({ item }) => {
                                // album card look like media card (reuse structure)
                                const fakeSong = {
                                    id: String(item?.id ?? Math.random()),
                                    name: item?.name ?? "Album",
                                    duration: 0,
                                    primaryArtists: item?.artists?.primary?.map((a: any) => a.name).join(", ") ?? "",
                                    image: item?.image ?? [],
                                    downloadUrl: [],
                                } as any;

                                return (
                                    <MediaCard
                                        song={fakeSong}
                                        onPress={() => nav.navigate("Album", { albumId: item?.id, title: item?.name })}
                                    />
                                );
                            }}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

function SectionTitle({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    return (
        <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>
            {onSeeAll ? (
                <Pressable onPress={onSeeAll}>
                    <Text style={[styles.seeAll, { color: c.green }]}>See All</Text>
                </Pressable>
            ) : (
                <View />
            )}
        </View>
    );
}

function ListBlock({
    title,
    data,
    onPress,
}: {
    title: string;
    data: Song[];
    onPress: (list: Song[], index: number) => void;
}) {
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    function formatDuration(d: any) {
        if (!d) return "";
        if (typeof d === "number") {
            const mins = Math.floor(d / 60);
            const secs = Math.floor(d % 60).
                toString()
                .padStart(2, "0");
            return `${mins}:${secs}`;
        }
        if (typeof d === "string") return d;
        return "";
    }

    return (
        <View style={{ paddingTop: 6 }}>
            <SectionTitle title={title} />
            {data.map((s, idx) => {
                const img =
                    s?.image?.find((x: any) => x.quality?.includes("150"))?.link ??
                    s?.image?.find((x: any) => x.quality?.includes("150"))?.url ??
                    s?.image?.[s.image?.length - 1]?.link ??
                    s?.image?.[s.image?.length - 1]?.url ??
                    null;

                return (
                    <Pressable
                        key={s.id}
                        onPress={() => onPress(data, idx)}
                        style={[styles.songRow, { borderColor: c.border }]}
                    >
                        {img ? (
                            <Image source={{ uri: img }} style={styles.rowImage} />
                        ) : (
                            <View style={[styles.rowImage, { backgroundColor: c.border }]} />
                        )}

                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={1} style={[styles.songTitle, { color: c.text }]}>
                                {s.name}
                            </Text>
                            <Text numberOfLines={1} style={[styles.songSub, { color: c.sub }]}> 
                                {s.primaryArtists ?? ""}  |  {formatDuration(s.duration)}
                            </Text>
                        </View>

                        <Pressable
                            onPress={async (e) => {
                                e.stopPropagation();
                                onPress(data, idx);
                            }}
                            style={[styles.playBtn, { backgroundColor: c.green }]}
                        >
                            <Ionicons name="play" size={16} color="white" />
                        </Pressable>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: "center", justifyContent: "center" },

    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoText: { fontSize: 28, fontWeight: "900" },

    sectionRow: {
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitle: { fontSize: 22, fontWeight: "900" },
    seeAll: { fontSize: 14, fontWeight: "900" },

    hList: { paddingLeft: 16, paddingRight: 6, paddingBottom: 10 },

    songRow: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    rowImage: { width: 64, height: 64, borderRadius: 12, marginRight: 12 },
    songTitle: { fontSize: 16, fontWeight: "800" },
    songSub: { fontSize: 12, marginTop: 4 },
    playBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginLeft: 10 },
});
