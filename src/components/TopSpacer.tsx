import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function TopSpacer({ height = 56 }: { height?: number }) {
    const insets = useSafeAreaInsets();
    return <View style={{ height: insets.top + height, width: "100%" }} pointerEvents="none" />;
}
