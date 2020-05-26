declare module "*.jpg" {
  const value: any;
  export = value;
}
declare module "*.png" {
  const value: any;
  export = value;
}

declare module "*.svg" {
  const value: any;
  export = value;
}

// In built types for some reason don't show beginElement() which is actually present
declare type AnimationElement = SVGAnimationElement & {
  beginElement: () => void;
};

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

declare type SearchResult =
  | {
      status: true;
      songs: Song[];
    }
  | {
      status: false;
      error?: string;
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

declare type Artist = {
  name: string;
  images: string[];
};
