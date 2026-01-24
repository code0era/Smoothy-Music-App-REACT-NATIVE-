import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";

export function ArtistCircle({
    name,
    imageUrl,
    onPress,
}: {
    name: string;
    imageUrl?: string | null;
    onPress?: () => void;
}) {
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    const Wrap: any = onPress ? Pressable : View;

    return (
        <Wrap onPress={onPress} style={styles.wrap}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.img} />
            ) : (
                <View style={[styles.img, { backgroundColor: c.border }]} />
            )}
            <Text numberOfLines={1} style={[styles.txt, { color: c.text }]}>
                {name}
            </Text>
        </Wrap>
    );
}

const styles = StyleSheet.create({
    wrap: { width: 110, marginRight: 14 },
    img: { width: 92, height: 92, borderRadius: 999 },
    txt: { marginTop: 10, fontSize: 14, fontWeight: "800" },
});
