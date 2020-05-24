declare type Song = {
  filePath: string;
  title: string;
  thumbnail: string;
  artist: string;
  length: number;
  numListens: number;
  albumId: string;
  liked: boolean;
};

declare type Album = {
  id: string;
  imagePath: string;
  name: string;
  numSongs: number;
  artist: string;
};

declare type CustomAlbum = {
  id: string;
  name: string;
  songs: string[];
};

declare type DBCustomAlbum = {
  id: string;
  name: string;
  songs: string;
};

declare type Artist = {
  name: string;
  images: string[];
};

declare type Settings = {
  folderStored: string;
  jumpAhead: number;
  seekAhead: number;
  seekBack: number;
  jumpBack: number;
  controlWindow: boolean;
  animations: boolean;
};

declare type SettingsKeys = keyof Settings;
