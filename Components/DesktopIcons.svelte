<script lang="ts">
  import {
    alignDesktopIcons,
    checkDesktopIconLength,
  } from "$apps/Wallpaper/ts/icons";
  import { appLibrary } from "$ts/stores/apps";
  import { UserDataStore } from "$ts/stores/user";
  import { App } from "$types/app";
  import { onMount } from "svelte";
  import DesktopIcon from "./DesktopIcons/DesktopIcon.svelte";

  let store: Map<string, App> = new Map([]);
  let loading = false;

  async function update() {
    if (
      !$UserDataStore.appdata["ArcShell"] ||
      !Object.keys($UserDataStore.appdata["ArcShell"])
        .join(",")
        .includes("icon$")
    ) {
      loading = true;
      await alignDesktopIcons();

      setTimeout(() => {
        loading = false;
      }, 100);
    }

    await checkDesktopIconLength();

    const len = store.size;
    const newStore = appLibrary.get();

    if (newStore.size !== len) {
      loading = true;
      store = newStore;
      setTimeout(() => {
        loading = false;
      });
    }
  }

  onMount(update);
  appLibrary.subscribe(update);
  UserDataStore.subscribe(update);
</script>

{#if !loading && $UserDataStore.sh.desktop.icons}
  <div
    class="desktopIcons taskbar-bounds tb-{$UserDataStore.sh.taskbar.pos}"
    class:docked={$UserDataStore.sh.taskbar.docked}
  >
    {#each [...store] as [_, app]}
      <DesktopIcon {app} />
    {/each}
  </div>
{/if}
