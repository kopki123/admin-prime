import type { ToastMessageOptions } from 'primevue/toast';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

type Severity = 'success' | 'info' | 'warn' | 'error';
type ShortcutOptions = Omit<ToastMessageOptions, 'severity'>;

export function useGlobalToast() {
  const toast = useToast();
  const { t } = useI18n({ useScope: 'global' });

  function showToast(options: ToastMessageOptions = {}) {
    const {
      detail = '',
      severity = 'success',
      summary = t(`common.toast.${severity}`),
      life = 3000,
      ...rest
    } = options;

    toast.add({
      detail,
      severity,
      life,
      summary,
      ...rest,
    });
  }

  const withSeverity = (severity: Severity) => (options: ShortcutOptions = {}) => showToast({ ...options, severity });

  return {
    showToast,
    showSuccess: withSeverity('success'),
    showInfo: withSeverity('info'),
    showWarn: withSeverity('warn'),
    showError: withSeverity('error'),
  };
}
