<script setup lang="ts">
import { PERMISSIONS } from '@/constants/permissions';

const emit = defineEmits<{
  (e: 'create'): void;
}>();

const keyword = defineModel<string>('keyword', { required: true });
</script>

<template>
  <div
    class="
      flex flex-wrap items-center justify-between gap-3
      rounded-xl border border-surface-200 bg-white p-4
      shadow-sm
      dark:border-surface-700 dark:bg-surface-900
    "
  >
    <div>
      <Button
        v-permission="PERMISSIONS.USER_CREATE"
        icon="pi pi-plus"
        :label="$t('user_management.add_user')"
        @click="emit('create')"
      />
    </div>

    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText
        v-model="keyword"
        class="w-80"
        :placeholder="$t('user_management.search_placeholder')"
      />
    </IconField>
  </div>
</template>
