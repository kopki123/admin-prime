<script setup lang="ts">
import Mask from './Mask.vue';
import LoaderSpinner from './LoaderSpinner.vue';

const visible = ref(false);

function show() {
  visible.value = true;
}

function hide() {
  visible.value = false;
}

defineExpose({ show, hide });
</script>

<template>
  <Transition name="fade">
    <Mask
      v-if="visible"
      class="flex justify-center items-center"
    >
      <LoaderSpinner />
    </Mask>
  </Transition>
</template>
