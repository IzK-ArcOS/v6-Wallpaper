<script lang="ts">
  import { isIconSpotAvailable } from "$apps/Wallpaper/ts/icons";
  import { isPopulatable, spawnApp } from "$ts/apps";
  import { getAppPreference, setAppPreference } from "$ts/server/user/pref";
  import { UserDataStore } from "$ts/stores/user";
  import { App } from "$types/app";
  import { DragEventData, draggable } from "@neodrag/svelte";

  import { onMount } from "svelte";

  export let app: App;

  let position = { x: 0, y: 0 };
  let previousPosition = { x: 0, y: 0 };
  let populatable = true;

  UserDataStore.subscribe((v) => {
    populatable = isPopulatable(app);
  });

  function open() {
    spawnApp(app.id);
  }

  function updatePos() {
    const pos = getAppPreference("ArcShell", `icon$${app.id}`) as {
      x: number;
      y: number;
    };

    position = pos || { x: 0, y: 0 };
  }

  onMount(updatePos);
  UserDataStore.subscribe(updatePos);

  function endDrag(e: CustomEvent<DragEventData>) {
    const { offsetX, offsetY } = e.detail;
    const available = isIconSpotAvailable(offsetX, offsetY);

    if (!available) {
      position = previousPosition;

      return;
    }

    setAppPreference("ArcShell", `icon$${app.id}`, {
      x: offsetX,
      y: offsetY,
    });
  }

  function startDrag(e: CustomEvent<DragEventData>) {
    previousPosition = { x: e.detail.offsetX, y: e.detail.offsetY };
  }
</script>

{#if populatable}
  <button
    class="desktopIcon"
    data-contextmenu="desktopicon-app"
    data-id={app.id}
    on:dblclick={open}
    use:draggable={{
      grid: $UserDataStore.sh.desktop.noIconGrid ? null : [40, 42.5],
      bounds: $UserDataStore.sh.desktop.noIconGrid
        ? { bottom: 80, left: 10, right: 10, top: 10 }
        : { bottom: 110, left: 0, right: 80, top: 0 },
      position,
      disabled: $UserDataStore.sh.desktop.lockIcons,
    }}
    on:neodrag:start={startDrag}
    on:neodrag:end={endDrag}
  >
    <img draggable={false} src={app.metadata.icon} alt={app.metadata.name} />
    <p class="name">{app.metadata.name}</p>
  </button>
{/if}
