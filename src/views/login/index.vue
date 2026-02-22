<script setup lang="ts">
import Form from '@primevue/forms/form';
import logo from '@/assets/images/logo.webp';
import { useLoginForm } from './composables/useLoginForm';
import LoginCredentialsFields from './components/LoginCredentialsFields.vue';
import LoginFormActionsRow from './components/LoginFormActionsRow.vue';
import LoginSocialButtons from './components/LoginSocialButtons.vue';

const {
  socialProviders,
  initialValues,
  loading,
  isSocialLoading,
  isFormDisabled,
  resolver,
  handleLogin,
  onSocialLogin,
} = useLoginForm();
</script>

<template>

  <Card class="w-full max-w-md shadow-xl">
    <template #title>
      <div class="flex justify-center items-center gap-4 text-center">
        <Image
          :src="logo"
          width="40"
          alt="logo"
        />
        <p class="text-3xl font-semibold">
          {{ $t('system.title') }}
        </p>
      </div>
    </template>

    <template #subtitle>
      <p class="mt-2 text-center text-sm text-surface-500 dark:text-surface-400">
        {{ $t('login_page.subtitle') }}
      </p>
    </template>

    <template #content>
      <Form
        v-slot="$form"
        class="mt-2 space-y-4"
        :resolver="resolver"
        :initial-values="initialValues"
        @submit="handleLogin"
      >
        <LoginCredentialsFields
          :email-invalid="Boolean($form.email?.invalid)"
          :email-error-message="$form.email?.error?.message"
          :password-invalid="Boolean($form.password?.invalid)"
          :password-error-message="$form.password?.error?.message"
        />

        <LoginFormActionsRow :disabled="isFormDisabled" />

        <Button
          type="submit"
          class="w-full"
          :label="$t('login_page.login_button')"
          :loading="loading"
          :disabled="isFormDisabled"
        />

        <LoginSocialButtons
          :providers="socialProviders"
          :loading-provider="isSocialLoading"
          :disabled="isFormDisabled"
          @social-login="onSocialLogin"
        />
      </Form>
    </template>
  </Card>
</template>
