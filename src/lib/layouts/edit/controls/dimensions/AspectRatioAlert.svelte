<script lang="ts">
  import * as Alert from '$lib/components/ui/alert'
  import IconAspectRatio from '~icons/material-symbols/aspect-ratio-outline'

  import { INKCLIP_ASPECT_RATIO } from '$lib/constants'
</script>

<Alert.Root>
  <IconAspectRatio aria-hidden />
  <Alert.Title>Image is not {String(Math.round(INKCLIP_ASPECT_RATIO * 100) / 100)}:1 ratio</Alert.Title>
  <Alert.Description>You need to choose how to scale your image.</Alert.Description>
</Alert.Root>
