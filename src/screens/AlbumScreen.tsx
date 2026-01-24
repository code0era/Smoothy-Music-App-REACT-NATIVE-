import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { getAlbumDetails } from "../api/saavn";
import { SongRow } from "../components/SongRow";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";
import { usePlayerStore } from "../store/playerStore";
import { audioService } from "../services/audioService";

export function AlbumScreen() {
    const nav = useNavigation<any>();
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    const route = useRoute<RouteProp<RootStackParamList, "Album">>();
    const albumId = route.params?.albumId;
    const title = route.params?.title;

    const setQueueAndPlay = usePlayerStore((s) => s.setQueueAndPlay);

    const [loading, setLoading] = useState(true);
    const [songs, setSongs] = useState<any[]>([]);
    const [albumName, setAlbumName] = useState(title ?? "Album");

    useEffect(() => {
        (async () => {
            setLoading(true);
            if (!albumId) {
                setSongs([]);
                setAlbumName(title ?? "Album");
                setLoading(false);
                return;
            }
            const d = await getAlbumDetails(albumId);
            setAlbumName(d?.name ?? title ?? "Album");
            setSongs(d?.songs ?? []);
            setLoading(false);
        })();
    }, [albumId]);

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: c.bg }]}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <FlatList
            style={{ backgroundColor: c.bg }}
            data={songs}
            keyExtractor={(x) => x.id}
            ListHeaderComponent={
                <View style={{ padding: 16 }}>
                    <Text style={{ color: c.text, fontSize: 22, fontWeight: "900" }}>{albumName}</Text>
                    <Text style={{ color: c.sub, marginTop: 6 }}>{songs.length} tracks</Text>
                </View>
            }
            renderItem={({ item, index }) => (
                <SongRow
                    song={item}
                    onPress={async () => {
                        setQueueAndPlay(songs as any, index);
                        const s = usePlayerStore.getState().activeSong;
                        if (s) await audioService.loadAndPlay(s);
                        nav.navigate("Player");
                    }}
                />
            )}
            contentContainerStyle={{ paddingBottom: 30 }}
        />
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
