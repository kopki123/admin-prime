<script setup lang="ts">
const isFullscreen = ref<boolean>(typeof document !== 'undefined' && Boolean(document.fullscreenElement));

function syncFullscreenState() {
  if (typeof document === 'undefined') return;

  isFullscreen.value = Boolean(document.fullscreenElement);
}

async function toggleFullscreen() {
  if (typeof document === 'undefined') return;

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.error('Failed to toggle fullscreen mode', error);
  } finally {
    syncFullscreenState();
  }
}

onMounted(() => {
  if (typeof document === 'undefined') return;

  syncFullscreenState();
  document.addEventListener('fullscreenchange', syncFullscreenState);
});

onUnmounted(() => {
  if (typeof document === 'undefined') return;

  document.removeEventListener('fullscreenchange', syncFullscreenState);
});
</script>

<template>
  <Button
    text
    rounded
    severity="secondary"
    :icon="isFullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'"
    :aria-label="$t('common.button.preview')"
    @click="toggleFullscreen"
  />
</template>
