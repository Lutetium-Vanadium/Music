export interface song {
  artist: string;
  fileName: string;
  thumbnail: string;
  title: string;
  length: number;
}

export interface searchResult {
  status: boolean;
  songs?: song[];
  error?: string;
}
