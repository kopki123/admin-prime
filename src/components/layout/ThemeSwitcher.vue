<script setup lang="ts">
import type { Theme } from '@/stores/config';
import { useConfigStore } from '@/stores/config';

const themeIconMap: Record<Theme, string> = {
  light: 'pi pi-sun',
  dark: 'pi pi-moon',
  system: 'pi pi-desktop',
};

const { t } = useI18n();
const configStore = useConfigStore();

const menu = ref();

const buttonIcon = computed(() => themeIconMap[configStore.theme]);

const options = computed(() => [
  { label: t('common.theme.light'), value: 'light', icon: themeIconMap.light },
  { label: t('common.theme.dark'), value: 'dark', icon: themeIconMap.dark },
  { label: t('common.theme.system'), value: 'system', icon: themeIconMap.system },
]);

function toggle(event: MouseEvent) {
  menu.value.toggle(event);
};
</script>

<template>
  <div>
    <Button
      :icon="buttonIcon"
      severity="contrast"
      text
      rounded
      @click="toggle"
    />

    <Menu
      ref="menu"
      :model="options"
      popup
    >
      <template #item="{ item }">
        <slot
          name="item"
          v-bind="item"
        >
          <div
            class="cursor-pointer flex items-center gap-2 p-2 text-sm hover:text-primary"
            :class="{
              'text-primary': configStore.theme === item.value
            }"
            @click="configStore.handleSwitchTheme(item.value)"
          >
            <i
              v-if="item.icon"
              :class="item.icon"
            />
            {{ item.label }}
          </div>
        </slot>
      </template>
    </Menu>
  </div>
</template>
