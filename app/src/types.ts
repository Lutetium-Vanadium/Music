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

export interface SearchResult {
  status: boolean;
  songs?: Song[];
  error?: string;
}

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
