export type TabsParamList = {
    Home: undefined;
    Search: undefined;
    Settings: undefined;
};

export type RootStackParamList = {
    Tabs: undefined;
    Album: { albumId: string; title?: string } | undefined;
    Artist: { artistId: string; name?: string } | undefined;
    Player: undefined;
    Queue: undefined;
};
