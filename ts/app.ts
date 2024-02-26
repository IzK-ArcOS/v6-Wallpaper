import { SafeMode } from "$state/Desktop/ts/store";
import { ComponentIcon } from "$ts/images/general";
import { UserDataStore } from "$ts/stores/user";
import { App } from "$types/app";
import AppSvelte from "../App.svelte";
import { WallpaperContext } from "./context";
import { WallpaperRuntime } from "./runtime";

export const desktopWallpaper: App = {
  metadata: {
    name: "Desktop Wallpaper",
    description: "The beautiful wallpaper you set; rendered.",
    author: "The ArcOS Team",
    version: "2.0.0",
    appGroup: "coreApps",
    icon: ComponentIcon,
    core: true,
    hidden: true,
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
    resizable: false,
  },
  singleInstance: true,
  contextMenu: WallpaperContext,
  loadCondition: () => !!UserDataStore.get(),
};
