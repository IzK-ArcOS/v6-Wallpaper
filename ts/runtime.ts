import type { App, AppMutator } from "$types/app";
import { AppRuntime } from "$ts/apps";

export class WallpaperRuntime extends AppRuntime {
  constructor(app: App, mutator: AppMutator) {
    super(app, mutator);
  }
}