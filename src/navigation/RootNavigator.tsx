import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import type { RootStackParamList, TabsParamList } from "./types";

import { HomeScreen } from "../screens/HomeScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { AlbumScreen } from "../screens/AlbumScreen";
import { ArtistScreen } from "../screens/ArtistScreen";
import { PlayerScreen } from "../screens/PlayerScreen";
import { QueueScreen } from "../screens/QueueScreen";

import { MiniPlayer } from "../components/MiniPlayer";
import { useSettingsStore } from "../store/settingsStore";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabsParamList>();

function Tabs() {
    const mode = useSettingsStore((s) => s.themeMode);
    const c = colors[mode];

    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: c.green,
                    tabBarInactiveTintColor: c.sub,
                    tabBarStyle: {
                        height: 66,
                        paddingTop: 8,
                        paddingBottom: 10,
                        borderTopColor: c.border,
                        backgroundColor: c.card,
                    },
                    tabBarIcon: ({ color, size, focused }) => {
                        const map: Record<string, any> = {
                            Home: focused ? "home" : "home-outline",
                            Search: focused ? "search" : "search-outline",
                            Settings: focused ? "settings" : "settings-outline",
                        };
                        return <Ionicons name={map[route.name]} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Search" component={SearchScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>

            <MiniPlayer />
        </>
    );
}

export function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="Album" component={AlbumScreen} options={{ title: "Album" }} />
            <Stack.Screen name="Artist" component={ArtistScreen} options={{ title: "Artist" }} />
            <Stack.Screen
                name="Player"
                component={PlayerScreen}
                options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen
                name="Queue"
                component={QueueScreen}
                options={{ presentation: "modal", title: "Queue" }}
            />
        </Stack.Navigator>
    );
}
