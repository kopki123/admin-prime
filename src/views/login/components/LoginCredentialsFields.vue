<script setup lang="ts">
interface Props {
  emailInvalid: boolean;
  emailErrorMessage?: string;
  passwordInvalid: boolean;
  passwordErrorMessage?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium text-surface-700 dark:text-surface-200">
      {{ $t('login_page.email_label') }}
    </label>
    <InputText
      name="email"
      type="email"
      class="w-full"
      :placeholder="$t('login_page.email_placeholder')"
      autocomplete="email"
    />
    <Message v-if="emailInvalid" severity="error" size="small" variant="simple">
      {{ emailErrorMessage }}
    </Message>
  </div>

  <div class="space-y-2">
    <label class="text-sm font-medium text-surface-700 dark:text-surface-200">
      {{ $t('login_page.password_label') }}
    </label>
    <Password
      name="password"
      class="w-full"
      input-class="w-full"
      :feedback="false"
      toggle-mask
      :placeholder="$t('login_page.password_placeholder')"
      autocomplete="current-password"
    />
    <Message v-if="passwordInvalid" severity="error" size="small" variant="simple">
      {{ passwordErrorMessage }}
    </Message>
  </div>
</template>
