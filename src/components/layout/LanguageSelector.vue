<script setup lang="ts">
import { useConfigStore } from '@/stores/config';
import { SUPPORTED_LOCALES } from '@/plugins/i18n';

const configStore = useConfigStore();

const menu = ref();

function toggle(event: MouseEvent) {
  menu.value.toggle(event);
};
</script>

<template>
  <div>
    <Button
      icon="pi pi-language"
      severity="contrast"
      text
      rounded
      @click="toggle"
    />

    <Menu
      ref="menu"
      :model="SUPPORTED_LOCALES"
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
              'text-primary': configStore.currentLocale === item.value
            }"
            @click="configStore.setLocale(item.value)"
          >
            {{ item.label }}
          </div>
        </slot>
      </template>
    </Menu>
  </div>
</template>
