<script setup lang="ts">
import Mask from '../Mask.vue';
import { useConfigStore } from '@/stores/config';
import SidebarMenu from './SidebarMenu.vue';

const configStore = useConfigStore();

const isSidebarHovering = ref(false);
const currentRouteMenuItems = ref<string[]>([]);
const expandedMenuPath = ref<string[]>([]);

const isSidebarHoverExpanded = computed(() => configStore.isSidebarExpanded || isSidebarHovering.value);

</script>

<template>
  <Transition name="fade">
    <Mask
      v-if="configStore.isSidebarExpanded"
      class="sm:hidden cursor-pointer"
      :class="[
        configStore.isSidebarExpanded ? '' : 'opacity-0 w-0 pointer-events-none'
      ]"
      @click="configStore.toggleSidebar"
    >
      <div
        class="
          overflow-y-auto
          h-full
          bg-white/95 dark:bg-surface-950/90
          backdrop-blur-xl
          border-r border-surface-200/70 dark:border-surface-700/70
          shadow-xl shadow-surface-900/5
          cursor-auto
        "
        :class="[
          configStore.isSidebarExpanded ? 'w-64' : 'w-0'
        ]"
        @click.stop
      >
        <SidebarMenu
          v-model:current-route-menu-items="currentRouteMenuItems"
          v-model:expanded-menu-path="expandedMenuPath"
          :is-expanded="isSidebarHoverExpanded"
        />
      </div>
    </Mask>
  </Transition>

  <div
    class="hidden sm:block relative shrink-0"
    :class="[configStore.isSidebarExpanded ? 'w-64' : 'w-14']"
    @mouseenter="isSidebarHovering = true"
    @mouseleave="isSidebarHovering = false"
  >
    <div
      class="
        sidebar-panel
        h-full
        bg-linear-to-b from-white to-surface-50/70
        dark:from-surface-950 dark:to-surface-900
        border-r border-surface-200/70 dark:border-surface-700/70
        backdrop-blur-xl
        relative
      "
      :class="[
        configStore.isSidebarExpanded
          ? 'overflow-y-auto w-64 sidebar-panel--dock'
          : (
            isSidebarHovering
              ? 'absolute left-0 top-0 overflow-y-auto w-64 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 sidebar-panel--overlay'
              : 'overflow-y-hidden w-14 sidebar-panel--dock'
          )
      ]"
    >
      <SidebarMenu
        v-model:current-route-menu-items="currentRouteMenuItems"
        v-model:expanded-menu-path="expandedMenuPath"
        :is-expanded="isSidebarHoverExpanded"
      />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  will-change: opacity, transform;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}

.sidebar-panel {
  transition-property: width, box-shadow, z-index;
  transition-duration: 200ms, 200ms, 0ms;
  transition-timing-function: ease, ease, linear;
}

.sidebar-panel--dock {
  z-index: 0;
  transition-delay: 0ms, 0ms, 200ms;
}

.sidebar-panel--overlay {
  z-index: 50;
  transition-delay: 0ms, 0ms, 0ms;
}
</style>
