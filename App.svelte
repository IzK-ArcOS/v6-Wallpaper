<script lang="ts">
  import { UserDataStore } from "$ts/stores/user";
  import { getWallpaper } from "$ts/wallpaper";
  import { App } from "$types/app";
  import "./css/main.css";

  let url = "";
  let previous = "";

  UserDataStore.subscribe(async (v) => {
    if (!v) return;

    console.log(v);
    const wallpaper = $UserDataStore.sh.desktop.wallpaper;

    if (previous == wallpaper) return;

    previous = wallpaper;

    const u = (await getWallpaper(wallpaper)).url;

    if (u != url) url = u;
  });
</script>

<div class="wallpaper fullscreen" style="background-image: url({url});" />
