<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';
import { RouteName } from '@/router/routeNames';

const route = useRoute();
const { t, locale } = useI18n();

const breadcrumbItems = ref<MenuItem[]>([]);

const breadcrumbHome = computed<MenuItem>(() => ({
  label: t('nav.dashboard'),
  route: { name: RouteName.Dashboard },
}));

function resolveMetaTitle(rawTitle: unknown): string {
  if (typeof rawTitle !== 'string') {
    return '';
  }

  const translatedTitle = t(rawTitle);

  return translatedTitle === rawTitle ? rawTitle : translatedTitle;
}

function syncBreadcrumbs() {
  const matchedRecords = route.matched
    .filter((record) => typeof record.meta?.i18nKey === 'string')
    .filter((record) => record.name && record.name !== RouteName.Dashboard);

  breadcrumbItems.value = matchedRecords.map((record, index) => {
    const item: MenuItem = {
      label: resolveMetaTitle(record.meta?.i18nKey),
    };

    const isLast = index === matchedRecords.length - 1;

    if (!isLast && record.name) {
      item.route = {
        name: record.name as string,
        params: route.params,
      };
    }

    return item;
  });
}

watch([() => route.fullPath, () => locale.value], syncBreadcrumbs, { immediate: true });
</script>

<template>
  <Breadcrumb
    class="border-0! bg-transparent! p-0!"
    :home="breadcrumbHome"
    :model="breadcrumbItems"
  >
    <template #item="{ item, props }">
      <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route">
        <a
          v-bind="props.action"
          :href="href"
          class="inline-flex items-center text-sm text-surface-600 dark:text-surface-300"
          @click="navigate"
        >
          <span>{{ item.label }}</span>
        </a>
      </RouterLink>
      <span v-else class="text-sm text-surface-700 dark:text-surface-200">
        {{ item.label }}
      </span>
    </template>
  </Breadcrumb>
</template>
