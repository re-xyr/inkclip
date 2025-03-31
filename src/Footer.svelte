<script lang="ts">
  import { mode, toggleMode } from 'mode-watcher'
  import { Button } from '$lib/components/ui/button'

  import IconLightMode from '~icons/material-symbols/light-mode'
  import IconDarkMode from '~icons/material-symbols/dark-mode'
</script>

<footer class="flex items-center text-sm text-muted-foreground">
  <div class="grow">
    2025 &copy; <a class="hover:underline" href="https://dayli.ly">daylily</a>
  </div>
  <Button size="icon" variant="ghost" onclick={toggleMode}>
    {#if $mode === 'dark'}
      <IconDarkMode />
    {:else}
      <IconLightMode />
    {/if}
  </Button>
</footer>
