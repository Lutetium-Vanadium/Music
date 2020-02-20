export interface song {
  artist: string;
  filePath: string;
  thumbnail: string;
  title: string;
  length: number;
  numListens: number;
}

export interface searchResult {
  status: boolean;
  songs?: song[];
  error?: string;
}

export interface album {
  id: string;
  imagePath: string;
  name: string;
  numSongs: number;
}
