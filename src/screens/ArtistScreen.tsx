import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { getArtistDetails, getArtistSongs } from "../api/saavn";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";
import { SongRow } from "../components/SongRow";
import { usePlayerStore } from "../store/playerStore";
import { audioService } from "../services/audioService";

export function ArtistScreen() {
    const route = useRoute<RouteProp<RootStackParamList, "Artist">>();
    const artistId = route.params?.artistId;
    const name = route.params?.name ?? "Artist";

    const nav = useNavigation<any>();
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    const setQueueAndPlay = usePlayerStore((s) => s.setQueueAndPlay);

    const [loading, setLoading] = useState(true);
    const [songs, setSongs] = useState<any[]>([]);
    const [artist, setArtist] = useState<any>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            if (!artistId) {
                setSongs([]);
                setArtist(null);
                setLoading(false);
                return;
            }
            const [a, s] = await Promise.all([getArtistDetails(artistId), getArtistSongs(artistId, 1, 50)]);
            if (!alive) return;
            setArtist(a);
            setSongs(s ?? []);
            setLoading(false);
        })();
        return () => {
            alive = false;
        };
    }, [artistId]);

    const play = async (list: any[], idx: number) => {
        setQueueAndPlay(list, idx);
        const s = usePlayerStore.getState().activeSong;
        if (s) await audioService.loadAndPlay(s);
        nav.navigate("Player");
    };

    if (loading) return (
        <View style={[styles.center, { backgroundColor: c.bg }]}>
            <ActivityIndicator />
        </View>
    );

    return (
        <FlatList
            style={{ flex: 1, backgroundColor: c.bg }}
            data={songs}
            keyExtractor={(x) => x.id}
            ListHeaderComponent={
                <View style={{ padding: 16 }}>
                    <Text style={{ color: c.text, fontSize: 22, fontWeight: "900" }}>{name}</Text>
                    <Text style={{ color: c.sub, marginTop: 6 }}>{songs.length} tracks</Text>
                </View>
            }
            renderItem={({ item, index }) => (
                <SongRow song={item} onPress={() => play(songs, index)} />
            )}
            contentContainerStyle={{ paddingBottom: 110 }}
        />
    );
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: "center", justifyContent: "center" } });
