<script setup lang="ts">
withDefaults(defineProps<{
  zIndex?: number;
}>(), {
  zIndex: 9999,
});
</script>

<template>
  <div
    class="
      z-(--z-index)
      absolute inset-0
      overflow-hidden
      w-full h-full
      bg-black/15 dark:bg-gray-700/70
      will-change-transform
    "
    :style="{
      '--z-index': zIndex,
    }"
  >
    <slot />
  </div>
</template>
