<script setup lang="ts">
import type { ChartData, ChartOptions, ScriptableContext, TooltipItem } from 'chart.js';

interface DashboardTrendDataset {
  labelKey: string;
  data: number[];
  borderColor: string;
}

interface DashboardTrendMock {
  labels: string[];
  datasets: DashboardTrendDataset[];
}

const { t } = useI18n();

const dashboardTrendMock: DashboardTrendMock = {
  labels: createLastNDaysLabels(30),
  datasets: [
    {
      labelKey: 'dashboard.sales_trend',
      borderColor: '#3B82F6',
      data: [
        4210,
        4380,
        4525,
        4650,
        4795,
        4930,
        4880,
        5010,
        5195,
        5270,
        5430,
        5580,
        5510,
        5690,
        5820,
        5975,
        6050,
        6190,
        6340,
        6480,
        6410,
        6590,
        6720,
        6885,
        7010,
        7140,
        7265,
        7390,
        7525,
        7680,
      ],
    },
  ],
};

const chartData = computed<ChartData<'line'>>(() => ({
  labels: dashboardTrendMock.labels,
  datasets: dashboardTrendMock.datasets.map((dataset) => ({
    label: t(dataset.labelKey),
    data: dataset.data,
    borderColor: dataset.borderColor,
    fill: true,
    borderWidth: 3,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointHoverBackgroundColor: '#ffffff',
    pointHoverBorderColor: dataset.borderColor,
    tension: 0.4,
    backgroundColor: (context: ScriptableContext<'line'>) => {
      const { chart } = context;
      const { ctx, chartArea } = chart;

      if (!chartArea) {
        return 'rgba(59, 130, 246, 0.16)';
      }

      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');

      return gradient;
    },
  })),
}));

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#0F172A',
      displayColors: false,
      callbacks: {
        label: (context: TooltipItem<'line'>) => {
          const amount = typeof context.parsed.y === 'number' ? context.parsed.y : 0;

          return `${t('dashboard.sales_trend')}: $${amount.toLocaleString()}`;
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
        maxTicksLimit: 10,
      },
    },
    y: {
      grid: {
        color: 'rgba(100, 116, 139, 0.2)',
      },
      ticks: {
        color: '#64748B',
        callback: (value) => `$${Number(value).toLocaleString()}`,
      },
    },
  },
}));

function createLastNDaysLabels(days: number): string[] {
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    const offset = days - index - 1;

    date.setDate(today.getDate() - offset);

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${month}/${day}`;
  });
}
</script>

<template>
  <Card class="border border-surface-200/70 shadow-sm dark:border-surface-700/70">
    <template #title>
      <div class="flex items-center gap-2 text-lg font-semibold text-surface-900 dark:text-white">
        <i class="pi pi-chart-line text-primary-500" />
        <span>{{ $t('dashboard.last30_days_trend_analysis') }}</span>
      </div>
      <p class="mt-1 text-sm font-normal text-surface-500 dark:text-surface-300">
        {{ $t('dashboard.trend_subtitle') }}
      </p>
    </template>

    <template #content>
      <div class="h-85">
        <Chart class="h-full w-full" type="line" :data="chartData" :options="chartOptions" />
      </div>
    </template>
  </Card>
</template>
