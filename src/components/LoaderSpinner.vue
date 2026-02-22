<script setup lang="ts">
const props = defineProps<{
  size?: string | number;
}>();

const DEFAULT_SIZE = '48px';

const sizeValue = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size || DEFAULT_SIZE);

// barWidth、barHeight、radius 比例可調整
const barWidth = computed(() => `calc(${sizeValue.value} / 12)`);
const barHeight = computed(() => `calc(${sizeValue.value} / 4)`);
const radius = computed(() => `calc(${sizeValue.value} / 2)`);
</script>

<template>
  <div
    class="relative will-change-auto"
    :style="{ width: sizeValue, height: sizeValue }"
  >
    <div
      v-for="i in 12"
      :key="i"
      class="
        absolute top-1/2 left-1/2
        bg-primary dark:bg-primary-300
        rounded-full
        origin-center animate-spinner-fade
      "
      :style="{
        width: barWidth,
        height: barHeight,
        transform: `rotate(${(i - 1) * 30}deg) translateY(calc(-1 * ${radius}))`,
        animationDelay: `${-((12 - i) * 0.1)}s`,
      }"
    />
  </div>
</template>

<style scoped>
@keyframes spinner-fade {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.animate-spinner-fade {
  animation: spinner-fade 1.2s linear infinite;
}
</style>
