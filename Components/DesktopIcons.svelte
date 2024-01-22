<script lang="ts">
  import { alignDesktopIcons } from "$apps/Wallpaper/ts/icons";
  import { appLibrary } from "$ts/stores/apps";
  import { UserDataStore } from "$ts/stores/user";
  import { onDestroy, onMount } from "svelte";
  import DesktopIcon from "./DesktopIcons/DesktopIcon.svelte";

  let loading = false;
  let alu;
  let udsu;
  async function update() {
    if (!$UserDataStore) return;
    if (
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
  }

  onMount(() => {
    update();

    alu = appLibrary.subscribe(update);
    udsu = UserDataStore.subscribe(update);
  });

  onDestroy(() => {
    alu();
    udsu();
  });
</script>

{#if !loading && $UserDataStore.sh.desktop.icons}
  <div
    class="desktopIcons taskbar-bounds tb-{$UserDataStore.sh.taskbar.pos}"
    class:docked={$UserDataStore.sh.taskbar.docked}
  >
    {#each [...$appLibrary] as [_, app]}
      <DesktopIcon {app} />
    {/each}
  </div>
{/if}
