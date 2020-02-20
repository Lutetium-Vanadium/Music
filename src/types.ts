export interface song {
  filePath: string;
  title: string;
  thumbnail: string;
  artist: string;
  length: number;
  numListens: number;
}

export interface album {
  id: string;
  imagePath: string;
  name: string;
  numSongs: number;
}
