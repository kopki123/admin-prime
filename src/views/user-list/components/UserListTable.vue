<script setup lang="ts">
import { PERMISSIONS } from '@/constants/permissions';
import LoaderSpinner from '@/components/LoaderSpinner.vue';
import type { User, UserRole, UserStatus } from '../types';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

interface Props {
  users: User[];
  loading: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'edit', user: User): void;
  (e: 'delete', user: User): void;
}>();

const { t } = useI18n();

function roleSeverity(role: UserRole): TagSeverity {
  if (role === 'admin') {
    return 'info';
  }

  if (role === 'manager') {
    return 'warn';
  }

  return 'success';
}

function roleLabel(role: UserRole): string {
  return t(`user_management.roles.${role}`);
}

function statusLabel(status: UserStatus): string {
  return t(`user_management.status.${status}`);
}

function statusDotClass(status: UserStatus): string {
  return status === 'active' ? 'text-green-500' : 'text-slate-400';
}

function statusTextClass(status: UserStatus): string {
  return status === 'active'
    ? 'text-green-700 dark:text-green-400'
    : 'text-surface-500 dark:text-surface-300';
}
</script>

<template>
  <div class="rounded-xl border border-surface-200 bg-white p-2 shadow-sm dark:border-surface-700 dark:bg-surface-900">
    <DataTable
      :value="users"
      :loading="loading"
      data-key="id"
      striped-rows
      paginator
      :rows="10"
      :rows-per-page-options="[10, 30, 50]"
    >
      <template #loading>
        <LoaderSpinner />
      </template>

      <template #empty>
        <div class="py-8 text-center text-surface-500">
          {{ $t('common.no_data') }}
        </div>
      </template>

      <Column field="id" :header="$t('user_management.columns.id')" />

      <Column :header="$t('user_management.columns.avatar')">
        <template #body="{ data }">
          <Avatar
            :image="data.avatar"
            size="normal"
            shape="circle"
          />
        </template>
      </Column>

      <Column field="name" :header="$t('user_management.columns.name')" />
      <Column field="email" :header="$t('user_management.columns.email')" />

      <Column :header="$t('user_management.columns.role')">
        <template #body="{ data }">
          <Tag :value="roleLabel(data.role)" :severity="roleSeverity(data.role)" rounded/>
        </template>
      </Column>

      <Column :header="$t('user_management.columns.status')">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <i
              class="pi pi-circle-fill text-xs"
              :class="statusDotClass(data.status)"
            />
            <span class="font-medium" :class="statusTextClass(data.status)">
              {{ statusLabel(data.status) }}
            </span>
          </div>
        </template>
      </Column>

      <Column :header="$t('user_management.columns.actions')">
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <Button
              v-permission="PERMISSIONS.USER_UPDATE"
              icon="pi pi-pencil"
              text
              rounded
              severity="secondary"
              :aria-label="$t('common.button.edit')"
              @click="emit('edit', data)"
            />
            <Button
              v-permission="PERMISSIONS.USER_DELETE"
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              :aria-label="$t('common.button.delete')"
              @click="emit('delete', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
