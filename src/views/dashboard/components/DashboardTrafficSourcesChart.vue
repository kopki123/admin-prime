<script setup lang="ts">
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';

const { t } = useI18n();

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: [
    t('dashboard.traffic_sources.direct'),
    t('dashboard.traffic_sources.social'),
    t('dashboard.traffic_sources.search'),
    t('dashboard.traffic_sources.ads'),
  ],
  datasets: [
    {
      label: t('dashboard.traffic_sources_title'),
      data: [36, 24, 28, 12],
      backgroundColor: ['#3B82F6', '#06B6D4', '#34D399', '#F59E0B'],
      hoverBackgroundColor: ['#2563EB', '#0891B2', '#10B981', '#D97706'],
      borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
      borderWidth: 2,
      hoverOffset: 6,
    },
  ],
}));

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '64%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 10,
        color: '#475569',
        padding: 16,
      },
    },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<'doughnut'>) => {
          const value = typeof context.parsed === 'number' ? context.parsed : 0;

          return `${context.label}: ${value}%`;
        },
      },
    },
  },
}));
</script>

<template>
  <Card class="border border-surface-200/70 shadow-sm dark:border-surface-700/70">
    <template #title>
      <div class="flex items-center gap-2 text-lg font-semibold text-surface-900 dark:text-white">
        <i class="pi pi-chart-pie text-cyan-500" />
        <span>{{ $t('dashboard.traffic_sources_title') }}</span>
      </div>
    </template>

    <template #content>
      <div class="h-80">
        <Chart class="h-full w-full" type="doughnut" :data="chartData" :options="chartOptions" />
      </div>
    </template>
  </Card>
</template>
