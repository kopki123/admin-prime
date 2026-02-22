<script setup lang="ts">
interface SocialProviderOption {
  id: string;
  icon: string;
}

interface Props {
  providers: readonly SocialProviderOption[];
  loadingProvider: string | null;
  disabled: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'social-login': [providerId: string];
}>();
</script>

<template>
  <Divider align="center">
    <span class="text-xs text-surface-500 dark:text-surface-300">
      {{ $t('login.divider_text') }}
    </span>
  </Divider>

  <div class="flex items-center justify-center gap-4">
    <Button
      v-for="provider in providers"
      :key="provider.id"
      severity="secondary"
      outlined
      :icon="provider.icon"
      :loading="loadingProvider === provider.id"
      :disabled="disabled"
      @click="emit('social-login', provider.id)"
    />
  </div>
</template>
