export type SaavnImage = { quality: string; link?: string; url?: string };
export type SaavnDownloadUrl = { quality: string; link?: string; url?: string };

export type Song = {
    id: string;
    name: string;
    duration: number | string;
    primaryArtists?: string;
    artists?: { primary?: { id: string; name: string }[] };
    album?: { id: string; name: string; url?: string };
    image?: SaavnImage[];
    downloadUrl?: SaavnDownloadUrl[];
};

export type SearchSongsResponse = {
    status?: string;
    success?: boolean;
    data?: { results?: Song[]; total?: number; start?: number };
};

export type AlbumDetails = {
    id?: string;
    name?: string;
    image?: SaavnImage[];
    songs?: Song[];
};
