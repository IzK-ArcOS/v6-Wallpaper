<script lang="ts">
  import { alignDesktopIcons } from "$apps/Wallpaper/ts/icons";
  import { isPopulatable } from "$ts/apps";
  import { appLibrary } from "$ts/stores/apps";
  import { UserDataStore } from "$ts/stores/user";
  import { onMount } from "svelte";
  import DesktopIcon from "./DesktopIcons/DesktopIcon.svelte";

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
    {#each [...$appLibrary] as [_, app]}
      {#if isPopulatable(app)}
        <DesktopIcon {app} />
      {/if}
    {/each}
  </div>
{/if}
