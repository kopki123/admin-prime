<script setup lang="ts">
import UserListTable from './components/UserListTable.vue';
import UserListToolbar from './components/UserListToolbar.vue';
import { useUserList } from './composables/useUserList';

const {
  keyword,
  loading,
  filteredUsers,
  openCreateDialog,
  openEditDialog,
  confirmDelete,
} = useUserList();
</script>

<template>
  <section class="space-y-4">
    <UserListToolbar
      v-model:keyword="keyword"
      @create="openCreateDialog"
    />

    <UserListTable
      :loading="loading"
      :users="filteredUsers"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />
  </section>
</template>
