import { Log } from "$ts/console";
import { appLibrary } from "$ts/stores/apps";
import { UserDataStore } from "$ts/stores/user";
import { sleep } from "$ts/util";

let LOCKED = false;

export async function alignDesktopIcons(overrideLock = false) {
  Log(
    "Wallpaper/ts/icons",
    `Automatically positioning desktop icons (OVERRIDE=${overrideLock}, LOCKED=${LOCKED})`
  );

  const udata = UserDataStore.get();

  if (LOCKED && !overrideLock) return;
  if (!overrideLock) LOCKED = true;

  if (!udata.appdata.ArcShell) udata.appdata.ArcShell = {};

  await sleep(100); // Wait for the rest of the apps to be loaded

  const library = appLibrary.get();
  const apps = []

  for (const [_, app] of library) {
    apps.push(app)
  }

  const GRIDX = 80;
  const GRIDY = 85;
  const MAXX = 4;

  let offsetX = 0;
  let offsetY = 0;

  for (const app of apps) {
    if (app.core || app.id == "ExperimentsApp") continue;

    Log(
      "Wallpaper/ts/icons",
      `Automatically positioning desktop icon for ${app.id}`
    );

    udata.appdata.ArcShell[`icon$${app.id}`] = {
      x: offsetX * GRIDX,
      y: offsetY * GRIDY,
    };

    await sleep(1);

    offsetX++;

    if (offsetX >= MAXX) {
      offsetX = 0;
      offsetY++;
    }
  }

  UserDataStore.set(udata);
}