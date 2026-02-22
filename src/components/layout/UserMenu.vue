<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const { showError } = useGlobalToast();
const authStore = useAuthStore();

const menu = ref();

const items = computed(() => [
  {
    label: t('common.logout'),
    icon: 'pi pi-sign-out',
    onClick: handleLogout,
  },
]);

function toggle(event: MouseEvent) {
  menu.value.toggle(event);
};

async function handleLogout() {
  try {
    await authStore.logout();

    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login?redirect=${redirect}`;
  } catch (error) {
    showError({ detail: (error as Error).message });
  }
}
</script>

<template>
  <div>
    <Button
      icon="pi pi-user"
      severity="contrast"
      text
      rounded
      @click="toggle"
    />

    <Menu
      ref="menu"
      :model="items"
      popup
    >
      <template #item="{ item }">
        <slot
          name="item"
          v-bind="item"
        >
          <div
            class="cursor-pointer flex items-center gap-2 p-2 text-sm"
            @click="item?.onClick"
          >
            <i
              v-if="item.icon"
              :class="item.icon"
            />
            <span>{{ item.label }}</span>
          </div>
        </slot>
      </template>
    </Menu>
  </div>
</template>
