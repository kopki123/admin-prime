import type { Component } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useDialog } from 'primevue/usedialog';
import PromptDialog from '@/components/PromptDialog.vue';

export type DialogPosition =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'center'
  | 'topleft'
  | 'topright'
  | 'bottomleft'
  | 'bottomright';

export interface AlertOptions {
  message?: string;
  position?: DialogPosition;
  blockScroll?: boolean;
}

export interface ConfirmOptions {
  message?: string;
  position?: DialogPosition;
  blockScroll?: boolean;
  accept?: () => void;
  reject?: () => void;
}

export interface PromptOptions {
  message?: string;
  position?: DialogPosition;
  blockScroll?: boolean;
  placeholder?: string;
  defaultValue?: string;
  validate?: (value: string) => string | undefined;
}

export type DialogController<ReturnData = unknown> = {
  result: Promise<ReturnData | null>;
  close: (data?: ReturnData) => void;
  cancel: () => void;
};

export function useGlobalDialog() {
  const { t } = useI18n({ useScope: 'global' });
  const confirm = useConfirm();
  const dialog = useDialog();

  const defaultLabelKeys = {
    ok: 'common.button.ok',
    confirm: 'common.button.confirm',
    cancel: 'common.button.cancel',
  };

  function alert(options: AlertOptions = {}): Promise<void> {
    const {
      message = '',
      position = 'top',
      blockScroll = true,
    } = options;

    return new Promise<void>((resolve) => {
      confirm.require({
        header: t('common.dialog.alert'),
        acceptLabel: t(defaultLabelKeys.confirm),
        acceptProps: {
          size: 'small',
        },
        rejectClass: 'hidden',
        message,
        position,
        blockScroll,
        accept: () => resolve(),
      });
    });
  }

  function confirmDialog(options: ConfirmOptions = {}): Promise<boolean> {
    const {
      message = '',
      position = 'center',
      blockScroll = true,
      accept,
      reject,
    } = options;

    return new Promise<boolean>((resolve) => {
      confirm.require({
        header: t('common.dialog.confirmation'),
        acceptLabel: t(defaultLabelKeys.confirm),
        rejectLabel: t(defaultLabelKeys.cancel),
        acceptProps: {
          size: 'small',
        },
        rejectProps: {
          severity: 'secondary',
          size: 'small',
        },
        message,
        position,
        blockScroll,
        accept: () => {
          accept?.();
          resolve(true);
        },
        reject: () => {
          reject?.();
          resolve(false);
        },
      });
    });
  }

  function prompt(options: PromptOptions = {}): Promise<string | null> {
    const {
      message = '',
      placeholder = '',
      defaultValue = '',
      blockScroll = true,
      position = 'center',
      validate,
    } = options;

    return new Promise<string | null>((resolve) => {
      dialog.open(PromptDialog, {
        data: {
          message,
          placeholder,
          defaultValue,
          validate,
        },
        props: {
          header: t('common.dialog.prompt'),
          blockScroll,
          position,
          modal: true,
          draggable: false,
        },
        onClose: (result: { data?: { value?: string; accepted?: boolean } } | undefined) => {
          if (!result?.data?.accepted) {
            return resolve(null);
          }

          resolve(result.data?.value ?? '');
        },
      });
    });
  }

  function open<ComponentProps = unknown, ReturnData = unknown>(
    component: Component,
    componentProps?: ComponentProps,
    dialogProps?: Record<string, unknown>,
  ): Promise<ReturnData | null> {
    return new Promise<ReturnData | null>((resolve) => {
      dialog.open(component, {
        data: componentProps,
        props: {
          modal: true,
          closable: true,
          blockScroll: true,
          draggable: false,
          ...dialogProps,
        },
        onClose: ({ data }: any) => {
          return resolve({ ...data } as ReturnData);
        },
      });
    });
  }

  function openWithController<ComponentProps = unknown, ReturnData = unknown>(
    component: Component,
    componentProps?: ComponentProps,
    dialogProps?: Record<string, unknown>,
  ): DialogController<ReturnData> {
    let resolveResult!: (value: ReturnData | null) => void;

    const result = new Promise<ReturnData | null>((resolve) => {
      resolveResult = resolve;
    });

    const dialogRef = dialog.open(component, {
      data: componentProps,
      props: {
        modal: true,
        closable: true,
        blockScroll: true,
        draggable: false,
        ...dialogProps,
      },
      onClose: (resultPayload: { data?: ReturnData } | undefined) => {
        resolveResult(resultPayload?.data ?? { accepted: false } as ReturnData);
      },
    });

    return {
      result,
      close(data?: ReturnData) {
        dialogRef.close(data);
      },
      cancel() {
        dialogRef.close();
      },
    };
  }

  return {
    alert,
    confirm: confirmDialog,
    prompt,
    open,
    openWithController,
  };
}
