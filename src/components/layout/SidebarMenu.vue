<script setup lang="ts">
import { useSidebarMenu } from '@/composables/useSidebarMenu';
import type { MenuItem as SidebarMenuItem } from '@/constants/sidebarMenu';
import MenuItem from './MenuItem.vue';

const props = withDefaults(
  defineProps<{
    isExpanded?: boolean
  }>(),
  {
    isExpanded: true,
  },
);

const currentRouteMenuItems = defineModel<string[]>('currentRouteMenuItems', { default: () => [] });
const expandedMenuPath = defineModel<string[]>('expandedMenuPath', { default: () => [] });

const { filteredMenu } = useSidebarMenu(expandedMenuPath, currentRouteMenuItems);

function resolveMenuKey(item: SidebarMenuItem, index: number): string {
  return item.to ?? item.url ?? `${item.labelKey}-${index}`;
}
</script>

<template>
  <ul class="list-none px-1 py-2">
    <template
      v-for="(item, index) in filteredMenu"
      :key="resolveMenuKey(item, index)"
    >
      <MenuItem
        v-model:current-route-menu-items="currentRouteMenuItems"
        v-model:expanded-menu-path="expandedMenuPath"
        :item="item"
        :index="index"
        :level="0"
        :is-expanded="props.isExpanded"
      />
    </template>
  </ul>
</template>
