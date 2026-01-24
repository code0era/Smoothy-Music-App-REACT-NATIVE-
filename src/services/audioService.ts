import { Audio } from "expo-av";
import type { Song } from "../api/types";
import { usePlayerStore } from "../store/playerStore";
import { useSettingsStore } from "../store/settingsStore";

class AudioService {
    private sound: Audio.Sound | null = null;
    private loading = false;

    async init() {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
    }

    private pickUrl(song: Song) {
        const q = useSettingsStore.getState().quality;
        const want =
            q === "high" ? ["320kbps", "160kbps", "96kbps"] :
                q === "medium" ? ["160kbps", "96kbps", "48kbps"] :
                    ["96kbps", "48kbps", "12kbps"];

        const arr = song.downloadUrl ?? [];
        for (const w of want) {
            const found = arr.find((x) => x.quality === w);
            const link = found?.link ?? found?.url;
            if (link) return link;
        }
        const fallback = arr[0]?.link ?? arr[0]?.url;
        return fallback ?? null;
    }

    private attachStatus() {
        if (!this.sound) return;
        this.sound.setOnPlaybackStatusUpdate((st) => {
            if (!st.isLoaded) return;
            usePlayerStore.getState().setPlaybackState({
                isPlaying: st.isPlaying,
                positionMs: st.positionMillis ?? 0,
                durationMs: st.durationMillis ?? 0,
            });

            if (st.didJustFinish) {
                this.handleFinish();
            }
        });
    }

    private async handleFinish() {
        const store = usePlayerStore.getState();
        const repeat = store.repeat;
        if (repeat === "one") {
            await this.seekTo(0);
            await this.play();
            return;
        }
        await this.next();
    }

    async loadAndPlay(song: Song) {
        if (this.loading) return;
        this.loading = true;

        try {
            const url = this.pickUrl(song);
            if (!url) return;

            if (this.sound) {
                try {
                    await this.sound.stopAsync();
                    await this.sound.unloadAsync();
                } catch { }
            }

            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true, positionMillis: 0 },
                undefined
            );

            this.sound = sound;
            this.attachStatus();
        } finally {
            this.loading = false;
        }
    }

    async play() {
        if (!this.sound) {
            const { activeSong } = usePlayerStore.getState();
            if (activeSong) await this.loadAndPlay(activeSong);
            return;
        }
        await this.sound.playAsync();
    }

    async pause() {
        if (!this.sound) return;
        await this.sound.pauseAsync();
    }

    async togglePlayPause() {
        const { isPlaying } = usePlayerStore.getState();
        if (isPlaying) await this.pause();
        else await this.play();
    }

    async seekTo(ms: number) {
        if (!this.sound) return;
        await this.sound.setPositionAsync(Math.max(0, ms));
    }

    private shuffledNextIndex() {
        const { queue, currentIndex } = usePlayerStore.getState();
        if (queue.length <= 1) return currentIndex;
        let i = currentIndex;
        while (i === currentIndex) i = Math.floor(Math.random() * queue.length);
        return i;
    }

    async next() {
        const store = usePlayerStore.getState();
        const { queue, currentIndex, shuffle, repeat } = store;
        if (!queue.length) return;

        let nextIndex = shuffle ? this.shuffledNextIndex() : currentIndex + 1;

        if (nextIndex >= queue.length) {
            if (repeat === "all") nextIndex = 0;
            else {
                await this.pause();
                return;
            }
        }

        store.setActiveIndex(nextIndex);
        const song = usePlayerStore.getState().activeSong;
        if (song) await this.loadAndPlay(song);
    }

    async prev() {
        const store = usePlayerStore.getState();
        const { queue, currentIndex } = store;
        if (!queue.length) return;

        const backToStart = usePlayerStore.getState().positionMs > 3000;
        const prevIndex = backToStart ? currentIndex : Math.max(0, currentIndex - 1);

        store.setActiveIndex(prevIndex);
        const song = usePlayerStore.getState().activeSong;
        if (song) await this.loadAndPlay(song);
    }
}

export const audioService = new AudioService();
