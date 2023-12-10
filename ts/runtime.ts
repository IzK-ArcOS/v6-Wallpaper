import type { App } from "$types/app";
import { AppRuntime } from "$ts/apps";

export class WallpaperRuntime extends AppRuntime {
  constructor(app: App) {
    super(app);
  }
}