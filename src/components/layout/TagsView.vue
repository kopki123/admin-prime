<script setup lang="ts">
import { RouteName } from '@/router/routeNames';
import type { VisitedView } from '@/stores/tagsView';
import { useTagsViewStore } from '@/stores/tagsView';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const tagsViewStore = useTagsViewStore();

const visitedViews = computed(() => tagsViewStore.visitedViews);

function resolveTitle(rawTitle: string): string {
  const translated = t(rawTitle);

  return translated === rawTitle ? rawTitle : translated;
}

function isActive(view: VisitedView): boolean {
  return view.path === route.path;
}

function isClosable(view: VisitedView): boolean {
  return view.name !== RouteName.Dashboard;
}

async function closeView(view: VisitedView) {
  if (!isClosable(view)) return;

  const removedView = tagsViewStore.deleteView(view);

  if (!removedView || !isActive(removedView)) return;

  const latestView = tagsViewStore.visitedViews.at(-1);

  if (latestView) {
    await router.push(latestView.fullPath);
    return;
  }

  await router.push({ name: RouteName.Dashboard });
}

watch(() => route.fullPath, () => tagsViewStore.addView(route), { immediate: true });
</script>

<template>
  <div
    class="
      border-b border-surface-200 bg-surface-100 shadow-2xl
      dark:border-surface-700 dark:bg-surface-900
    "
  >
    <div class="overflow-x-auto flex items-center gap-2 p-4">
      <RouterLink
        v-for="view in visitedViews"
        :key="view.path"
        :to="view.fullPath"
        class="
          shrink-0 inline-flex items-center gap-2 px-2 py-1
          rounded-md border text-sm transition-all duration-150
        "
        :class="isActive(view)
          ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
          : 'border-surface-300 bg-white text-surface-700 hover:border-primary-300 hover:text-primary-600 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300'"
      >
        <span
          v-if="isActive(view)"
          class="w-2 h-2 rounded-full bg-white/90"
        />
        <span class="max-w-40 truncate">
          {{ resolveTitle(view.meta.i18nKey) }}
        </span>

        <button
          v-if="isClosable(view)"
          class="inline-flex items-center justify-center rounded-full p-1 transition-colors hover:cursor-pointer"
          :class="[
            isActive(view) ? 'hover:bg-white/10' : 'hover:bg-surface-300/20',
          ]"
          :aria-label="$t('common.button.close')"
          @click.prevent.stop="closeView(view)"
        >
          <i class="pi pi-times text-xs" />
        </button>
      </RouterLink>
    </div>
  </div>
</template>
