<script setup lang="ts">
import Form from '@primevue/forms/form';
import type { FormSubmitEvent } from '@primevue/forms/form';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { userSchema } from '@/schemas/user';
import type { UserDialogData, UserForm } from '../types';

interface DialogRef {
  value: {
    data: UserDialogData;
  };
}

const { t } = useI18n();
const dialogRef = inject<DialogRef>('dialogRef');

const data = dialogRef!.value.data;
const roleOptions = data.roleOptions;

const saving = ref(false);

interface UserDialogFormValues {
  name: string;
  email: string;
  role: UserForm['role'];
  status: boolean;
}

const initialValues: UserDialogFormValues = { ...data.form };

const resolver = computed(() => {
  return zodResolver(
    z.object({
      name: userSchema.shape.userName,
      email: userSchema.shape.email,
      role: userSchema.shape.roleId,
      status: z.boolean(),
    }),
  );
});

function statusLabel(status: boolean): string {
  return status ? t('user_management.status.active') : t('user_management.status.inactive');
}

function onCancel() {
  data.onCancel();
}

async function onSave(event: FormSubmitEvent) {
  if (!event.valid) return;

  const values = event.values as Record<string, unknown>;

  saving.value = true;

  try {
    await data.onSubmit({
      ...data.form,
      name: typeof values.name === 'string' ? values.name : '',
      email: typeof values.email === 'string' ? values.email : '',
      role: values.role as UserForm['role'],
      status: Boolean(values.status),
    });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Form
    v-slot="$form"
    class="grid grid-cols-1 gap-4"
    :resolver="resolver"
    :initial-values="initialValues"
    @submit="onSave"
  >
    <div class="space-y-2">
      <label class="text-sm font-medium text-surface-700 dark:text-surface-200">
        {{ $t('user_management.form.name') }}
      </label>
      <InputText
        name="name"
        class="w-full"
        :placeholder="$t('user_management.form.name_placeholder')"
      />
      <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
        {{ t($form.name?.error?.message || 'api_error_message.unknown') }}
      </Message>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium text-surface-700 dark:text-surface-200">
        {{ $t('user_management.form.email') }}
      </label>
      <InputText
        name="email"
        class="w-full"
        :placeholder="$t('user_management.form.email_placeholder')"
      />
      <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
        {{ t($form.email?.error?.message || 'api_error_message.unknown') }}
      </Message>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium text-surface-700 dark:text-surface-200">
        {{ $t('user_management.form.role') }}
      </label>
      <Select
        name="role"
        class="w-full"
        :options="roleOptions"
        option-label="label"
        option-value="value"
      />
      <Message v-if="$form.role?.invalid" severity="error" size="small" variant="simple">
        {{ t($form.role?.error?.message || 'api_error_message.unknown') }}
      </Message>
    </div>

    <div
      class="
        flex items-center justify-between
        rounded-lg border border-surface-200 px-3 py-3
        dark:border-surface-700
      "
    >
      <div class="space-y-1">
        <p class="text-sm font-medium text-surface-700 dark:text-surface-100">
          {{ $t('user_management.form.status') }}
        </p>
        <p class="text-xs text-surface-500 dark:text-surface-300">
          {{ statusLabel(Boolean($form.status?.value ?? initialValues.status)) }}
        </p>
      </div>
      <ToggleSwitch name="status" />
    </div>

    <div class="flex justify-end gap-2">
      <Button
        type="button"
        severity="secondary"
        text
        :label="$t('common.button.cancel')"
        @click="onCancel"
      />
      <Button
        type="submit"
        icon="pi pi-check"
        :label="$t('common.button.save')"
        :loading="saving"
      />
    </div>
  </Form>
</template>
