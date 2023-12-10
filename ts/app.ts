import { DefaultIcon } from "$ts/images/apps";
import { WallpaperRuntime } from "./runtime";
import AppSvelte from "../App.svelte";
import { App } from "$types/app";

export const desktopWallpaper: App = {
  metadata: {
    name: "Desktop Wallpaper",
    description: "The beautiful wallpaper you set; rendered.",
    author: "The ArcOS Team",
    version: "1.0.0",
    icon: DefaultIcon,
    core: true
  },
  runtime: WallpaperRuntime,
  content: AppSvelte,
  id: "desktopWallpaper",
  size: { w: 0, h: 0 },
  minSize: { w: 0, h: 0 },
  maxSize: { w: 0, h: 0 },
  pos: { x: 0, y: 0 },
  controls: { minimize: false, maximize: false, close: false },
  state: {
    minimized: false,
    maximized: false,
    headless: false,
    fullscreen: false,
  }
}