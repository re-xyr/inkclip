<script lang="ts">
import { Button } from '$lib/components/ui/button'
import { mode, toggleMode } from 'mode-watcher'
import IconDarkMode from '~icons/material-symbols/dark-mode'
import IconLightMode from '~icons/material-symbols/light-mode'
</script>

<footer class="row text-sm text-muted-foreground">
  <div class="grow">
    {new Date().getFullYear()} &copy;
    <a class="no-underline hover:underline" href="https://dayli.ly">daylily</a>
  </div>
  <Button size="icon" variant="ghost" onclick={toggleMode} aria-label="Toggle color scheme">
    {#if mode.current === 'dark'}
      <IconDarkMode aria-hidden />
    {:else}
      <IconLightMode aria-hidden />
    {/if}
  </Button>
</footer>
