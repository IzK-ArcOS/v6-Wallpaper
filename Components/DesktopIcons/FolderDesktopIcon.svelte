<script lang="ts">
  import { findFreeDesktopIconPosition } from "$apps/Wallpaper/ts/icons";
  import { spawnApp } from "$ts/apps";
  import { FolderIcon } from "$ts/images/filesystem";
  import { getAppPreference, setAppPreference } from "$ts/server/user/pref";
  import { appLibrary } from "$ts/stores/apps";
  import { UserDataStore } from "$ts/stores/user";
  import { PartialUserDir } from "$types/fs";
  import { DragEventData, draggable } from "@neodrag/svelte";
  import { onMount } from "svelte";

  export let folder: PartialUserDir;
  export let wrapper: HTMLDivElement;

  let id = "";
  let position = { x: 0, y: 0 };
  let icon = FolderIcon;
  let name = "Folder";

  function update() {
    updatePos();
  }

  UserDataStore.subscribe(update);
  appLibrary.subscribe(update);

  onMount(() => {
    id = folder.scopedPath.replaceAll("/", "_").replaceAll(".", "_");

    name = folder.name;
    update();
  });

  function updatePos() {
    const pos = getAppPreference("ArcShell", `icon$${id}`) as {
      x: number;
      y: number;
    };

    console.log(pos);

    position = pos || findFreeDesktopIconPosition(wrapper);
    /* 
    if (!pos) {
      setAppPreference("ArcShell", `icon$${id}`, position);
    } */
  }

  function open() {
    spawnApp("FileManager", 0, [folder.scopedPath]);
  }

  function endDrag(e: CustomEvent<DragEventData>) {
    const { offsetX, offsetY } = e.detail;

    setAppPreference("ArcShell", `icon$${id}`, {
      x: offsetX,
      y: offsetY,
    });
  }
</script>

<button
  class="desktopIcon"
  class:virtual={folder.virtual}
  data-id={id}
  on:dblclick={open}
  use:draggable={{
    grid: $UserDataStore.sh.desktop.noIconGrid ? null : [40, 42.5],
    bounds: $UserDataStore.sh.desktop.noIconGrid
      ? { bottom: 80, left: 10, right: 10, top: 10 }
      : { bottom: 110, left: 0, right: 80, top: 0 },
    position,
    disabled: $UserDataStore.sh.desktop.lockIcons,
  }}
  on:neodrag:end={endDrag}
>
  <div class="img">
    <img draggable={false} src={icon} alt={id} />
  </div>
  <p class="name">{name}</p>
</button>
