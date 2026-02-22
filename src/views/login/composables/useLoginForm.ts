import { z } from 'zod';
import type { FormSubmitEvent } from '@primevue/forms/form';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { getAxiosErrorMessage } from '@/api/axiosInstance';
import { RouteName } from '@/router/routeNames';
import { useAuthStore } from '@/stores/auth';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginPayload {
  email: string;
  password: string;
}

const socialProviders = [
  { id: 'google', icon: 'pi pi-google' },
  { id: 'github', icon: 'pi pi-github' },
] as const;

type SocialProvider = (typeof socialProviders)[number]['id'];

function normalizeRedirectTarget(target: unknown): string | null {
  if (Array.isArray(target)) {
    return normalizeRedirectTarget(target[0]);
  }

  if (typeof target === 'string' && target.trim()) {
    return target;
  }

  return null;
}

export function useLoginForm() {
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const { showSuccess, showError } = useGlobalToast();
  const authStore = useAuthStore();

  const initialValues: LoginFormValues = {
    email: 'admin@gmail.com',
    password: '123456',
    rememberMe: false,
  };

  const loading = ref(false);
  const isSocialLoading = ref<SocialProvider | null>(null);
  const isFormDisabled = computed(() => loading.value || Boolean(isSocialLoading.value));

  const resolver = computed(() => {
    return zodResolver(
      z.object({
        email: z
          .string()
          .trim()
          .min(1, { message: t('common.form.validation.email.required') })
          .email({ message: t('common.form.validation.email.invalid') }),
        password: z
          .string()
          .trim()
          .min(1, { message: t('common.form.validation.password.required') }),
        rememberMe: z.boolean().optional(),
      }),
    );
  });

  async function loginAndRedirect(payload: LoginPayload, successMessage: string): Promise<boolean> {
    try {
      const loginResponse = await authStore.login(payload);

      if (!loginResponse.success) {
        return false;
      }

      await authStore.getMyPermissions();

      showSuccess({ detail: successMessage });
      redirectAfterLogin();

      return true;
    } catch (error: unknown) {
      const message = getAxiosErrorMessage(error) || t('api_error_message.unknown');
      showError({ detail: message });
      return false;
    }
  }

  async function handleLogin(event: FormSubmitEvent) {
    if (!event.valid) return;

    const values = event.values as LoginFormValues;
    const rememberMe = Boolean(values.rememberMe);

    loading.value = true;

    try {
      const success = await loginAndRedirect(
        {
          email: values.email,
          password: values.password,
        },
        t('login_page.messages.login_success'),
      );

      if (success && rememberMe) {
        console.log('已紀錄使用者偏好');
      }
    } finally {
      loading.value = false;
    }
  }

  async function handleSocialLogin(provider: SocialProvider) {
    if (isFormDisabled.value) return;

    isSocialLoading.value = provider;

    try {
      const providerLabel = t(`login.social.${provider}`);

      await loginAndRedirect(
        {
          email: 'admin@gmail.com',
          password: '123456',
        },
        t('login.social_success', { provider: providerLabel }),
      );
    } finally {
      isSocialLoading.value = null;
    }
  }

  function onSocialLogin(providerId: string) {
    if (!isSocialProvider(providerId)) return;
    void handleSocialLogin(providerId);
  }

  function isSocialProvider(providerId: string): providerId is SocialProvider {
    return socialProviders.some((provider) => provider.id === providerId);
  }

  function redirectAfterLogin() {
    const redirect = normalizeRedirectTarget(route.query.redirect);

    router.replace(redirect || { name: RouteName.Dashboard });
  }

  return {
    socialProviders,
    initialValues,
    loading,
    isSocialLoading,
    isFormDisabled,
    resolver,
    handleLogin,
    onSocialLogin,
  };
}
