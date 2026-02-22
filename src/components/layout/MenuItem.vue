<script setup lang="ts">
import type { MenuItem } from '@/constants/sidebarMenu';

const props = withDefaults(
  defineProps<{
    item: MenuItem
    index: number
    level: number
    parentPath?: string[]
    isExpanded?: boolean
  }>(),
  {
    parentPath: () => [],
    isExpanded: true,
  },
);

const router = useRouter();

const currentRouteMenuItems = defineModel<string[]>('currentRouteMenuItems', { default: () => [] });
const expandedMenuPath = defineModel<string[]>('expandedMenuPath', { default: () => [] });

const itemPath = computed(() => [...props.parentPath, String(props.index)]);

// 標示目前路由是否為此選單項目（僅頁面連結）
const isActiveMenuItem = computed(() => props.item.to ? router.currentRoute.value.name === props.item.to : false);
// 標示目前路由所在層級的選單路徑是否為此項目
const isActiveMenuPath = computed(() => currentRouteMenuItems.value[props.level] === String(props.index));
// 標示此層級選單是否展開（用於子選單）
const isExpandedMenu = computed(() => expandedMenuPath.value[props.level] === String(props.index));
// 收合模式下只保留目前路由所在展開路徑的子選單 icon，避免全部節點都渲染
const shouldRenderChildren = computed(() => Boolean(props.item.items) && (props.isExpanded || isExpandedMenu.value));

function handleToggleExpandMenu() {
  if (!props.isExpanded) {
    return;
  }

  if (isExpandedMenu.value) {
    expandedMenuPath.value = itemPath.value.slice(0, -1);
    return;
  }

  expandedMenuPath.value = [...itemPath.value];
}

function resolveChildKey(child: MenuItem, index: number): string {
  return child.to ?? child.url ?? `${child.labelKey}-${index}`;
}
</script>

<template>
  <li>
    <!-- 有子選單的小標 -->
    <div
      v-if="item.items"
      class="
        relative mx-2 my-1 h-11 cursor-pointer rounded-xl border border-transparent
        flex items-center transition-all duration-200
      "
      :class="[
        isExpanded ? 'justify-between px-3' : 'justify-center px-0',
        level === 0
          ? (
            isActiveMenuPath
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-200 dark:hover:bg-surface-800/80 dark:hover:text-surface-50'
          )
          : (
            isActiveMenuPath
              ? 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
              : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800/70 dark:hover:text-surface-100'
          ),
      ]"
      @click="handleToggleExpandMenu"
    >
      <div
        class="flex min-w-0 items-center"
        :class="isExpanded ? 'gap-3' : 'justify-center'"
      >
        <i
          v-if="item.icon"
          class="text-base transition-colors duration-200"
          :class="item.icon"
        />
        <Transition name="menu-label">
          <span
            v-show="isExpanded"
            class="truncate text-sm font-medium tracking-wide"
          >
            {{ $t(item.labelKey) }}
          </span>
        </Transition>
      </div>

      <Transition name="menu-label">
        <i
          v-if="isExpanded"
          class="pi pi-angle-down text-xs opacity-80 transition-transform duration-200"
          :class="{
            'rotate-180': isExpandedMenu
          }"
        />
      </Transition>
    </div>

    <!-- 外部連結 -->
    <a
      v-if="item.url"
      :href="item.url"
      :target="item.target"
      tabindex="0"
      rel="noopener noreferrer"
      class="
        relative mx-2 my-1 h-11 rounded-xl border border-transparent
        flex items-center transition-all duration-200
      "
      :class="[
        isExpanded ? 'px-3 gap-3' : 'justify-center px-0',
        'text-surface-700 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-200 dark:hover:bg-surface-800/80 dark:hover:text-surface-50',
      ]"
    >
      <i
        v-if="item.icon"
        class="text-base transition-colors duration-200"
        :class="item.icon"
      />
      <Transition name="menu-label">
        <span
          v-if="isExpanded"
          class="truncate text-sm font-medium tracking-wide"
        >
          {{ $t(item.labelKey) }}
        </span>
      </Transition>
    </a>

    <!-- 頁面連結 -->
    <RouterLink
      v-if="item.to && !item.items"
      :to="{ name: item.to }"
      class="
        relative mx-2 my-1 h-11 rounded-xl border border-transparent
        flex items-center transition-all duration-200
      "
      :class="[
        isExpanded ? 'px-3 gap-3' : 'justify-center px-0',
        level === 0
          ? (
            isActiveMenuItem
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-200 dark:hover:bg-surface-800/80 dark:hover:text-surface-50'
          )
          : (
            isActiveMenuItem
              ? 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
              : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800/70 dark:hover:text-surface-100'
          ),
      ]"
    >
      <i
        v-if="item.icon && item.to"
        class="text-base transition-colors duration-200"
        :class="item.icon"
      />
      <Transition name="menu-label">
        <span
          v-if="isExpanded"
          class="truncate text-sm font-medium tracking-wide"
        >
          {{ $t(item.labelKey) }}
        </span>
      </Transition>

      <span
        v-if="isExpanded && isActiveMenuItem"
        class="ml-auto inline-flex h-2 w-2 rounded-full bg-current/70"
      />
    </RouterLink>

    <!-- 子選單 -->
    <Transition
      v-if="shouldRenderChildren"
      name="menu-item"
    >
      <ul
        v-show="isExpandedMenu"
        class="overflow-hidden transition-all duration-200"
        :class="isExpanded
          ? 'mx-2 my-1 space-y-1 border-l border-surface-200/80 pl-2 dark:border-surface-700/70'
          : 'my-1 space-y-1'"
      >
        <MenuItem
          v-for="(child, i) in item.items"
          :key="resolveChildKey(child, i)"
          v-model:current-route-menu-items="currentRouteMenuItems"
          v-model:expanded-menu-path="expandedMenuPath"
          :index="i"
          :item="child"
          :level="level + 1"
          :parent-path="itemPath"
          :is-expanded="isExpanded"
        />
      </ul>
    </Transition>
  </li>
</template>

<style scoped>
.menu-item-enter-from,
.menu-item-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
}

.menu-item-enter-to,
.menu-item-leave-from {
  max-height: 520px;
  opacity: 1;
  transform: translateY(0);
}

.menu-item-enter-active,
.menu-item-leave-active {
  overflow: hidden;
  transition: max-height 0.24s ease, opacity 0.2s ease, transform 0.2s ease;
}

.menu-label-enter-from,
.menu-label-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}

.menu-label-enter-to,
.menu-label-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.menu-label-enter-active,
.menu-label-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
</style>
