<script lang="ts">
  import { getAppById, isPopulatable } from "$ts/apps";
  import { isDisabled } from "$ts/apps/disable/utils";
  import { FileIcon } from "$ts/images/filesystem";
  import { OpenFile } from "$ts/server/fs/file/handler";
  import { getMimeIcon } from "$ts/server/fs/mime";
  import { getAppPreference, setAppPreference } from "$ts/server/user/pref";
  import { appLibrary } from "$ts/stores/apps";
  import { UserDataStore } from "$ts/stores/user";
  import { App } from "$types/app";
  import { PartialArcFile } from "$types/fs";
  import { DragEventData, draggable } from "@neodrag/svelte";
  import { onMount } from "svelte";

  export let item: PartialArcFile;

  let populatable = true;
  let isApp = false;
  let id = "";
  let position = { x: 0, y: 0 };
  let app: App;
  let icon = FileIcon;
  let name = "File";

  function update() {
    populatable = isApp ? isPopulatable(app) && !isDisabled(id) : true;
    updatePos();
  }

  UserDataStore.subscribe(update);
  appLibrary.subscribe(update);

  onMount(() => {
    const split = item.filename.split(".");
    const last = split[split.length - 1];

    id = last == "app" ? split[0] : item.scopedPath.replaceAll("/", "_").replaceAll(".", "_");
    isApp = last == "app";

    if (isApp) app = getAppById(id);

    icon = item.icon || getMimeIcon(item.filename) || FileIcon;
    name = isApp ? app.metadata.name : item.filename;
    update();
  });

  function updatePos() {
    const pos = getAppPreference("ArcShell", `icon$${id}`) as {
      x: number;
      y: number;
    };

    position = pos || { x: 0, y: 0 };
  }

  function open() {
    if (item.onOpen) {
      item.onOpen(item);

      return;
    }

    OpenFile(item);
  }

  function endDrag(e: CustomEvent<DragEventData>) {
    const { offsetX, offsetY } = e.detail;

    setAppPreference("ArcShell", `icon$${id}`, {
      x: offsetX,
      y: offsetY,
    });
  }
</script>

{#if populatable}
  <button
    class="desktopIcon"
    data-id={id}
    title={name}
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
    class:virtual={item.virtual}
  >
    <div class="img">
      <img draggable={false} src={icon} alt={id} />
    </div>
    <p class="name">{name}</p>
  </button>
{/if}
