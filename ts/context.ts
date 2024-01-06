import { OpenSettingsPage } from "$apps/Settings/ts/main";
import { SEP_ITEM } from "$state/Desktop/ts/store";
import { spawnApp } from "$ts/apps";
import { AppInfoIcon } from "$ts/images/apps";
import { AppsIcon, DesktopIcon, PersonalizationIcon, ThemesIcon } from "$ts/images/general";
import { ShutdownIcon } from "$ts/images/power";
import { createErrorDialog } from "$ts/process/error";
import { killAllAppInstances } from "$ts/process/kill";
import { ProcessStack } from "$ts/stores/process";
import { UserDataStore } from "$ts/stores/user";
import { AppContextMenu } from "$types/app";
import { alignDesktopIcons } from "./icons";

export const WallpaperContext: AppContextMenu = {
  "shell-wallpaper": [
    {
      caption: "Show desktop icons",
      action: () => {
        UserDataStore.update((udata) => {
          udata.sh.desktop.icons = !udata.sh.desktop.icons;

          return udata;
        });
      },
      icon: "apps",
      isActive: () => UserDataStore.get().sh.desktop.icons,
    },
    {
      caption: "Align icons to grid",
      action: () => {
        UserDataStore.update((udata) => {
          udata.sh.desktop.noIconGrid = !udata.sh.desktop.noIconGrid;

          return udata;
        });
      },
      icon: "grid_4x4",
      isActive: () => !UserDataStore.get().sh.desktop.noIconGrid,
    },
    {
      caption: "Lock desktop icons",
      action: () => {
        UserDataStore.update((udata) => {
          udata.sh.desktop.lockIcons = !udata.sh.desktop.lockIcons;

          return udata;
        });
      },
      icon: "lock",
      isActive: () => UserDataStore.get().sh.desktop.lockIcons,
    },
    {
      caption: "Reset icon alignment",
      action: () => {
        createErrorDialog({
          title: "Reset icon alignment?",
          message: "This will arrange the desktop icons back to their default positions. Do you want to continue?",
          image: DesktopIcon,

          buttons: [{
            caption: "Reset",
            action() {
              alignDesktopIcons(true);
            },
            suggested: true,
          },
          { caption: "Cancel", action() { } }],
          sound: "arcos.dialog.warning"
        }, ProcessStack.getAppPids("ArcShell")[0], true);
      },
      icon: "undo",
    },
    SEP_ITEM,
    /* {
      caption: "File Manager",
      action: () => {
        openWindow("FileManager");
      },
      image: FileManagerIcon,
    }, */
    /* {
      caption: "Application Manager",
      action: () => {
        openWindow("AppMan");
      },
      image: AppManIcon,
    }, */
    {
      caption: "App settings",
      action: () => {
        OpenSettingsPage("apps");
      },
      image: AppsIcon,
    },
    /* SEP_ITEM,
    {
      caption: "Shut down",
      action: shutdown,
      image: ShutdownIcon,
    }, *//* 
    {
      caption: "Restart",
      action: () => restart(false),
      image: RestartIcon,
    }, */
    SEP_ITEM,
    {
      caption: "Themes",
      action: () => {
        OpenSettingsPage("themes");
      },
      image: ThemesIcon,
    },
    {
      caption: "Wallpaper",
      action: () => {
        OpenSettingsPage("wallpaper");
      },
      image: DesktopIcon,
    },
    {
      caption: "Visuals",
      action: () => {
        OpenSettingsPage("visuals");
      },
      image: PersonalizationIcon,
    },
  ],
  "desktopicon-app": [
    {
      caption: "Open",
      action(window, data) {
        spawnApp(data.id);
      },
      icon: "launch",
    },
    {
      image: ShutdownIcon,
      caption: "Kill",
      action(window, data) {
        killAllAppInstances(data.id);
      },
    },
    /* SEP_ITEM,
    {
      image: TrashIcon,
      caption: "Disable",
      action(window, data, scope) {
        disableApp(data.id);
      },
    }, */
    SEP_ITEM,
    {
      image: AppInfoIcon,
      caption: "App Info",
      action(window, data, scope) {
        spawnApp("AppInfo", 0, [data.id])
      },
    },
  ],
}