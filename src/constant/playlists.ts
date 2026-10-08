export type TrackKind = 'song' | 'album';

export interface Track {
    title: string;
    artist: string;
    movie: string;
    kind?: TrackKind;
    link?: string;
    note?: string;
}

export interface Playlist {
    id: string;
    title: string;
    tracks: Track[];
}

export const playlists: Playlist[] = [
    {
        id: 'movie-music',
        title: 'Music From My Favorite Movies',
        tracks: [
            { title: "All Out of Love", artist: "Air Supply", movie: "One Night Only" },
            { title: "Only You", artist: "Yazoo", movie: "One Night Only" },
            { title: "Supersonic Rocket Ship", artist: "The Kinks", movie: "Avengers: Endgame" },
            { title: "Bye Bye Bye", artist: "*NSYNC", movie: "Deadpool & Wolverine" },
            { title: "Sunflower", artist: "Post Malone, Swae Lee", movie: "Spider-Man: Into the Spider-Verse" },
            { title: "Black Panther: The Album", artist: "Kendrick Lamar & various artists", movie: "Black Panther", kind: "album" },
            { title: "I Ain't Worried", artist: "OneRepublic", movie: "Top Gun: Maverick" },
        ],
    },
];
