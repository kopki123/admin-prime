<script setup lang="ts">
interface KpiCard {
  id: string;
  titleKey: string;
  value: string;
  icon: string;
  iconContainerClass: string;
  iconClass: string;
  trendPercent: number;
}

const kpiCards: KpiCard[] = [
  {
    id: 'sales',
    titleKey: 'dashboard.total_sales',
    value: '$128,500',
    icon: 'pi pi-dollar',
    iconContainerClass: 'bg-blue-100 dark:bg-blue-900/40',
    iconClass: 'text-blue-600 dark:text-blue-300',
    trendPercent: 12.4,
  },
  {
    id: 'orders',
    titleKey: 'dashboard.total_orders',
    value: '3,420',
    icon: 'pi pi-shopping-cart',
    iconContainerClass: 'bg-amber-100 dark:bg-amber-900/40',
    iconClass: 'text-amber-600 dark:text-amber-300',
    trendPercent: 8.1,
  },
  {
    id: 'customers',
    titleKey: 'dashboard.new_customers',
    value: '892',
    icon: 'pi pi-users',
    iconContainerClass: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconClass: 'text-emerald-600 dark:text-emerald-300',
    trendPercent: 5.6,
  },
  {
    id: 'conversion',
    titleKey: 'dashboard.conversion_rate',
    value: '6.8%',
    icon: 'pi pi-chart-line',
    iconContainerClass: 'bg-fuchsia-100 dark:bg-fuchsia-900/40',
    iconClass: 'text-fuchsia-600 dark:text-fuchsia-300',
    trendPercent: -0.7,
  },
];

function formatTrendPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function trendTextClass(value: number): string {
  return value >= 0
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-rose-600 dark:text-rose-400';
}

function trendIcon(value: number): string {
  return value >= 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-right';
}
</script>

<template>
  <section class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card
      v-for="item in kpiCards"
      :key="item.id"
      class="border border-surface-200/70 shadow-sm dark:border-surface-700/70"
    >
      <template #content>
        <div class="flex items-start justify-between gap-3">
          <p class="text-sm font-medium text-surface-500 dark:text-surface-300">
            {{ $t(item.titleKey) }}
          </p>
          <span
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl"
            :class="item.iconContainerClass"
          >
            <i class="text-xl" :class="[item.icon, item.iconClass]" />
          </span>
        </div>

        <p class="mt-5 text-3xl font-semibold tracking-tight text-surface-900 dark:text-white">
          {{ item.value }}
        </p>

        <div
          class="mt-3 flex items-center gap-1 text-sm font-semibold"
          :class="trendTextClass(item.trendPercent)"
        >
          <i :class="trendIcon(item.trendPercent)" />
          <span>{{ formatTrendPercent(item.trendPercent) }}</span>
          <span class="font-medium text-surface-500 dark:text-surface-300">
            {{ $t('dashboard.vs_last_month') }}
          </span>
        </div>
      </template>
    </Card>
  </section>
</template>
