export interface song {
  filePath: string;
  title: string;
  thumbnail: string;
  artist: string;
  length: number;
  numListens: number;
  albumId: string;
  liked: boolean;
}

export interface album {
  id: string;
  imagePath: string;
  name: string;
  numSongs: number;
}
