import { Log } from "$ts/console";
import { appLibrary } from "$ts/stores/apps";
import { UserDataStore } from "$ts/stores/user";
import { sleep } from "$ts/util";
import { App } from "$types/app";

let LOCKED = false;

export async function alignDesktopIcons(overrideLock = false) {
  Log(
    "Wallpaper/ts/icons",
    `Automatically positioning desktop icons (OVERRIDE=${overrideLock}, LOCKED=${LOCKED})`
  );

  const udata = UserDataStore.get();

  if (LOCKED && !overrideLock) return;
  if (!overrideLock) LOCKED = true;

  await sleep(100); // Wait for the rest of the apps to be loaded

  const library = appLibrary.get();

  let apps: App[] = [];

  for (const [_, app] of library) {
    apps.push(app);
  }

  apps = apps.sort((a) => (a.metadata.hidden || a.metadata.core ? 1 : -1));

  const GRIDX = 80;
  const GRIDY = 85;
  const MAXX = 4;

  let offsetX = 0;
  let offsetY = 0;

  for (const app of apps) {
    if (app.id == "ExperimentsApp") continue;

    Log("Wallpaper/ts/icons", `Automatically positioning desktop icon for ${app.id}`);

    udata.appdata.ArcShell[`icon$${app.id}`] = {
      x: offsetX * GRIDX,
      y: offsetY * GRIDY,
    };

    offsetX++;

    if (offsetX >= MAXX) {
      offsetX = 0;
      offsetY++;
    }
  }

  UserDataStore.set(udata);
}

export function findFreeDesktopIconPosition(wrapper: HTMLDivElement): { x: number; y: number } {
  let x = 0;
  let y = 0;

  const udata = UserDataStore.get();

  if (!Object.keys(udata.appdata["ArcShell"]).join(",").includes("icon$")) {
    return { x, y };
  }

  function taken(x: number, y: number): boolean {
    const appdata = udata.appdata["ArcShell"] as Record<string, { x: number; y: number }>;
    const values = Object.values(appdata);
    const filtered = values.filter((v) => v.x == x * 80 && v.y == y * 85);

    return !!filtered.length;
  }

  let maxX = Math.floor(wrapper.offsetWidth / 80);
  let maxY = Math.floor(wrapper.offsetHeight / 85);

  let foundValue = false;

  while (!foundValue) {
    x++;
    if (x >= maxX - 1) {
      x = 0;

      y++;
    }

    if (y > maxY - 1) {
      return { x: x * 80, y: y * 85 };
    }

    const isTaken = taken(x, y);

    if (!isTaken) foundValue = true;
  }

  return { x: x * 80, y: y * 85 };
}
