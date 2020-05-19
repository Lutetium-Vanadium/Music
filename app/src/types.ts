export interface Song {
  filePath: string;
  title: string;
  thumbnail: string;
  artist: string;
  length: number;
  numListens: number;
  albumId: string;
  liked: boolean;
}

export type SearchResult =
  | {
      status: true;
      songs: Song[];
    }
  | {
      status: false;
      error?: string;
    };

export interface Album {
  id: string;
  imagePath: string;
  name: string;
  numSongs: number;
  artist: string;
}

export interface Artist {
  name: string;
  images: string[];
}
