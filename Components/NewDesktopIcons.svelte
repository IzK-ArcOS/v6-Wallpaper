<script lang="ts">
  import { createDirectory, readDirectory } from "$ts/server/fs/dir";
  import { UserDataStore } from "$ts/stores/user";
  import { PartialArcFile, PartialUserDir } from "$types/fs";
  import { onMount } from "svelte";
  import NewDesktopIcon from "./DesktopIcons/NewDesktopIcon.svelte";
  import { GlobalDispatch } from "$ts/process/dispatch/global";
  import { alignDesktopIcons } from "../ts/icons";
  import { sleep } from "$ts/util";
  import FolderDesktopIcon from "./DesktopIcons/FolderDesktopIcon.svelte";

  let files: PartialArcFile[] = [];
  let dirs: PartialUserDir[] = [];
  let loading = true;
  let created = false;

  async function update() {
    loading = true;

    if (!created) {
      await createDirectory("./Desktop");

      created = true;
    }

    files = [];
    const directory = await readDirectory("Desktop");
    files = directory ? directory.files : [];
    dirs = directory ? directory.directories : [];

    if (!$UserDataStore || !$UserDataStore.appdata || !$UserDataStore.appdata["ArcShell"]) return;

    if (!Object.keys($UserDataStore.appdata["ArcShell"]).join(",").includes("icon$")) {
      await alignDesktopIcons(true);
      await sleep(100);
    }

    loading = false;
  }

  onMount(async () => {
    await update();
    GlobalDispatch.subscribe("fs-flush", update);
  });
</script>

{#if !loading && $UserDataStore.sh.desktop.icons}
  <div
    class="desktopIcons taskbar-bounds tb-{$UserDataStore.sh.taskbar.pos}"
    class:docked={$UserDataStore.sh.taskbar.docked}
  >
    {#each dirs as folder}
      <FolderDesktopIcon {folder} />
    {/each}
    {#each files as item}
      <NewDesktopIcon {item} />
    {/each}
  </div>
{/if}
