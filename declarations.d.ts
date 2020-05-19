declare module "ffmpeg-cli" {
  interface Ffmpeg {
    path: string;
    runSync: (command: string) => any;
    run: (command: string) => Promise<any>;
    forceDownload: () => boolean;
  }

  let ffmpeg: Ffmpeg;

  export = ffmpeg;
}
