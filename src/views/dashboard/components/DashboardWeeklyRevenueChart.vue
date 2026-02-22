<script setup lang="ts">
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';

const { t } = useI18n();

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: [
    t('dashboard.weekdays.monday'),
    t('dashboard.weekdays.tuesday'),
    t('dashboard.weekdays.wednesday'),
    t('dashboard.weekdays.thursday'),
    t('dashboard.weekdays.friday'),
    t('dashboard.weekdays.saturday'),
    t('dashboard.weekdays.sunday'),
  ],
  datasets: [
    {
      label: t('dashboard.weekly_revenue_dataset'),
      data: [8200, 9100, 8650, 9800, 11200, 10350, 9570],
      backgroundColor: 'rgba(96, 165, 250, 0.72)',
      borderColor: '#60A5FA',
      borderWidth: 1,
      borderRadius: 10,
      borderSkipped: false,
      barPercentage: 0.72,
      categoryPercentage: 0.72,
    },
  ],
}));

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#475569',
      },
    },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<'bar'>) => {
          const amount = typeof context.parsed.y === 'number' ? context.parsed.y : 0;

          return `${t('dashboard.weekly_revenue_dataset')}: $${amount.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#64748B',
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.22)',
      },
      ticks: {
        color: '#64748B',
        callback: (value) => `$${Number(value).toLocaleString()}`,
      },
    },
  },
}));
</script>

<template>
  <Card class="border border-surface-200/70 shadow-sm dark:border-surface-700/70">
    <template #title>
      <div class="flex items-center gap-2 text-lg font-semibold text-surface-900 dark:text-white">
        <i class="pi pi-chart-bar text-sky-500" />
        <span>{{ $t('dashboard.weekly_revenue_title') }}</span>
      </div>
    </template>

    <template #content>
      <div class="h-80">
        <Chart class="h-full w-full" type="bar" :data="chartData" :options="chartOptions" />
      </div>
    </template>
  </Card>
</template>
