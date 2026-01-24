import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePlayerStore } from "../store/playerStore";
import { useSettingsStore } from "../store/settingsStore";

const KEY_PLAYER = "PLAYER_STATE_V1";
const KEY_SETTINGS = "SETTINGS_STATE_V1";

export async function hydrateStores() {
    const [p, s] = await Promise.all([
        AsyncStorage.getItem(KEY_PLAYER),
        AsyncStorage.getItem(KEY_SETTINGS),
    ]);

    if (s) useSettingsStore.setState(JSON.parse(s));
    if (p) usePlayerStore.setState(JSON.parse(p));
}

export async function persistPlayer() {
    const st = usePlayerStore.getState();
    const toSave = {
        queue: st.queue,
        currentIndex: st.currentIndex,
        recentlyPlayed: st.recentlyPlayed,
        shuffle: st.shuffle,
        repeat: st.repeat,
        activeSong: st.activeSong,
    };
    await AsyncStorage.setItem(KEY_PLAYER, JSON.stringify(toSave));
}

export async function persistSettings() {
    const st = useSettingsStore.getState();
    await AsyncStorage.setItem(KEY_SETTINGS, JSON.stringify(st));
}
