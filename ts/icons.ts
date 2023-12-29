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

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];

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

export async function checkDesktopIconLength() {
  const udata = UserDataStore.get()
  const shell = udata.appdata["ArcShell"];

  if (!shell) return;

  const icons = Object.keys(shell).map((i) => i.startsWith("icon$")).length;
  const apps = appLibrary.get().size;

  // TODO: Properly do this function
}

export function isIconSpotAvailable(x: number, y: number) {
  /* const [IW, IH] = [80, 85];
  const udata = get(UserData);
  const shell = udata.appdata["ArcShell"] as {
    [key: string]: { x: number; y: number };
  };

  if (!shell) return false;

  const icons = Object.keys(shell).filter((i) => i.startsWith("icon$"));

  for (let i = 0; i < icons.length; i++) {
    const icon = shell[icons[i]];

    if (
      icon &&
      ((x >= icon.x && x < icon.x + IW && y >= icon.y && y < icon.y + IH) ||
        (icon.x >= x && icon.x < x + IW && icon.y >= y && icon.y < y + IH))
    )
      return false;
  }
 */
  return true;
}
