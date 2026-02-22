<script setup lang="ts">
import DashboardKpiCards from './components/DashboardKpiCards.vue';
import DashboardSalesTrendChart from './components/DashboardSalesTrendChart.vue';
import DashboardTrafficSourcesChart from './components/DashboardTrafficSourcesChart.vue';
import DashboardWeeklyRevenueChart from './components/DashboardWeeklyRevenueChart.vue';
</script>

<template>
  <div class="space-y-6">
    <DashboardKpiCards />
    <DashboardSalesTrendChart />

    <section class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <DashboardWeeklyRevenueChart />
      <DashboardTrafficSourcesChart />
    </section>
  </div>
</template>
