<script setup lang="ts">
interface DialogRef {
  value: {
    data: {
      defaultValue?: string;
      message?: string;
      placeholder?: string;
      validate?: (value: string) => string | undefined;
    };
    close: (result?: { value: string | null; accepted: boolean }) => void;
  };
}

const { t } = useI18n();

const dialogRef = inject<DialogRef>('dialogRef');

const {
  defaultValue,
  message,
  placeholder,
  validate,
} = dialogRef!.value.data;

const value = ref<string>(defaultValue ?? '');
const error = ref<string | undefined>();

function onAccept() {
  if (validate) {
    const message = validate(value.value);
    error.value = message;

    if (message) return;
  }

  dialogRef!.value.close({ value: value.value, accepted: true });
}

function onReject() {
  dialogRef!.value.close({ value: null, accepted: false });
}
</script>

<template>
  <div class="space-y-4">
    <p v-if="message">
      {{ message }}
    </p>

    <div class="space-y-2">
      <InputText
        v-model="value"
        fluid
        :placeholder="placeholder"
        :class="{ 'p-invalid': !!error }"
      />
      <Message
        v-if="error"
        size="small"
        severity="error"
        variant="simple"
      >
        {{ error }}
      </Message>
    </div>

    <div class="flex justify-end items-center gap-2">
      <Button
        :label="t('common.button.cancel')"
        size="small"
        severity="secondary"
        outlined
        @click="onReject"
      />
      <Button
        :label="t('common.button.confirm')"
        size="small"
        @click="onAccept"
      />
    </div>
  </div>
</template>
