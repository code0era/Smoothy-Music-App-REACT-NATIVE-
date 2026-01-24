import { api } from "./client";
import type { AlbumDetails, SearchSongsResponse } from "./types";

export async function searchSongs(query: string, page = 1, limit = 20) {
    const { data } = await api.get<SearchSongsResponse>("/api/search/songs", {
        params: { query, page, limit },
    });
    const results = data?.data?.results ?? [];
    const total = data?.data?.total ?? results.length;
    return { results, total };
}

export async function searchAlbums(query: string, page = 1, limit = 20) {
    const { data } = await api.get("/api/search/albums", {
        params: { query, page, limit },
    });
    return data?.data?.results ?? [];
}

export async function searchArtists(query: string, page = 1, limit = 20) {
    const { data } = await api.get("/api/search/artists", {
        params: { query, page, limit },
    });
    return data?.data?.results ?? [];
}

export async function getArtistDetails(artistId: string) {
    try {
        const { data } = await api.get(`/api/artists/${artistId}`);
        return data?.data ?? data ?? null;
    } catch (err) {
        return null;
    }
}

export async function getArtistSongs(artistId: string, page = 1, limit = 50) {
    try {
        const { data } = await api.get(`/api/artists/${artistId}/songs`, { params: { page, limit } });
        return data?.data ?? data ?? [];
    } catch (err) {
        return [];
    }
}

export async function getLyrics(songTitle: string, artistName: string): Promise<string | null> {
    try {
        // Use free lyrics.ovh API (no auth required)
        const artist = encodeURIComponent(artistName.split(",")[0].trim() || "Unknown");
        const title = encodeURIComponent(songTitle || "");
        const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data?.lyrics ?? null;
    } catch {
        return null;
    }
}

/**
 * Album endpoint shape differs across wrappers.
 * We try common patterns:
 * 1) /api/albums?id=<id>
 * 2) /api/albums/<id>
 */
export async function getAlbumDetails(albumId: string): Promise<AlbumDetails> {
    try {
        const { data } = await api.get("/api/albums", { params: { id: albumId } });
        return data?.data ?? data ?? {};
    } catch {
        const { data } = await api.get(`/api/albums/${albumId}`);
        return data?.data ?? data ?? {};
    }
}
