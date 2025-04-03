<script lang="ts">
  import * as Alert from '$lib/components/ui/alert'
  import IconAspectRatio from '~icons/material-symbols/aspect-ratio-outline'
</script>

<Alert.Root>
  <IconAspectRatio aria-hidden />
  <Alert.Title>Image is not 1:1 ratio</Alert.Title>
  <Alert.Description>You need to choose how to scale your image.</Alert.Description>
</Alert.Root>
