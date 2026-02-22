<script setup lang="ts">
interface Props {
  disabled: boolean;
}

defineProps<Props>();
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <Checkbox
        name="rememberMe"
        input-id="rememberMe"
        :disabled="disabled"
        binary
      />
      <label
        for="rememberMe"
        class="cursor-pointer text-sm text-surface-700 dark:text-surface-200"
      >
        {{ $t('login.remember_me') }}
      </label>
    </div>

    <button
      class="
        text-sm text-primary-600 transition-colors
        hover:cursor-pointer hover:underline
        disabled:cursor-not-allowed disabled:opacity-60
        dark:text-primary-400
      "
      :disabled="disabled"
    >
      {{ $t('login.forgot_password') }}
    </button>
  </div>
</template>
