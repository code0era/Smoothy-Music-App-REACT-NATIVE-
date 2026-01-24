import { create } from "zustand";
import type { Song } from "../api/types";
import { persistPlayer } from "../services/storage";

export type RepeatMode = "off" | "one" | "all";

type PlayerState = {
    queue: Song[];
    currentIndex: number;
    activeSong: Song | null;

    isPlaying: boolean;
    positionMs: number;
    durationMs: number;

    shuffle: boolean;
    repeat: RepeatMode;

    recentlyPlayed: Song[];

    setQueueAndPlay: (songs: Song[], index: number) => void;
    addToQueue: (song: Song) => void;
    removeFromQueue: (index: number) => void;
    reorderQueue: (songs: Song[]) => void;

    setActiveIndex: (i: number) => void;
    setPlaybackState: (p: Partial<Pick<PlayerState, "isPlaying" | "positionMs" | "durationMs">>) => void;

    toggleShuffle: () => void;
    cycleRepeat: () => void;

    pushRecentlyPlayed: (song: Song) => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
    queue: [],
    currentIndex: 0,
    activeSong: null,

    isPlaying: false,
    positionMs: 0,
    durationMs: 0,

    shuffle: false,
    repeat: "off",

    recentlyPlayed: [],

    setQueueAndPlay: (songs, index) => {
        const activeSong = songs[index] ?? null;
        set({ queue: songs, currentIndex: index, activeSong, positionMs: 0 });
        if (activeSong) get().pushRecentlyPlayed(activeSong);
        persistPlayer();
    },

    addToQueue: (song) => {
        set({ queue: [...get().queue, song] });
        persistPlayer();
    },

    removeFromQueue: (index) => {
        const st = get();
        const next = st.queue.filter((_, i) => i !== index);

        let newIndex = st.currentIndex;
        if (index < st.currentIndex) newIndex--;
        if (newIndex < 0) newIndex = 0;

        const activeSong = next[newIndex] ?? null;
        set({ queue: next, currentIndex: newIndex, activeSong });
        persistPlayer();
    },

    reorderQueue: (songs) => {
        const st = get();
        const activeId = st.activeSong?.id;
        const newIndex = activeId ? Math.max(0, songs.findIndex((x) => x.id === activeId)) : 0;
        set({ queue: songs, currentIndex: newIndex, activeSong: songs[newIndex] ?? null });
        persistPlayer();
    },

    setActiveIndex: (i) => {
        const st = get();
        const activeSong = st.queue[i] ?? null;
        set({ currentIndex: i, activeSong, positionMs: 0 });
        if (activeSong) st.pushRecentlyPlayed(activeSong);
        persistPlayer();
    },

    setPlaybackState: (p) => set(p as any),

    toggleShuffle: () => {
        set({ shuffle: !get().shuffle });
        persistPlayer();
    },

    cycleRepeat: () => {
        const cur = get().repeat;
        const next: RepeatMode = cur === "off" ? "all" : cur === "all" ? "one" : "off";
        set({ repeat: next });
        persistPlayer();
    },

    pushRecentlyPlayed: (song) => {
        const st = get();
        const filtered = st.recentlyPlayed.filter((x) => x.id !== song.id);
        const next = [song, ...filtered].slice(0, 30);
        set({ recentlyPlayed: next });
        persistPlayer();
    },
}));
