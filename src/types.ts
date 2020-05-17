declare global {
  type SettingsKeys = keyof Settings;
}

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

export interface Settings {
  folderStored: string;
  jumpAhead: number;
  seekAhead: number;
  seekBack: number;
  jumpBack: number;
  controlWindow: boolean;
  animations: boolean;
}
