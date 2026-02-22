import { getAxiosErrorMessage } from '@/api/axiosInstance';
import {
  createUserApi,
  deleteUserApi,
  fetchUsersApi,
  updateUserApi,
} from '@/api/users';
import type {
  RoleOption,
  User,
  UserDialogData,
  UserDialogResult,
  UserForm,
  UserPayload,
} from '../types';
import UserListDialog from '../components/UserListDialog.vue';

const DEFAULT_USER_FORM: UserForm = {
  id: null,
  avatar: '',
  name: '',
  email: '',
  role: 'user',
  status: true,
};

function buildAvatarByName(name: string): string {
  const seed = encodeURIComponent(name.trim().toLowerCase() || 'new-user');
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
}

function buildUserPayload(userForm: UserForm): UserPayload {
  return {
    avatar: userForm.avatar || buildAvatarByName(userForm.name),
    name: userForm.name.trim(),
    email: userForm.email.trim().toLowerCase(),
    role: userForm.role,
    status: userForm.status ? 'active' : 'inactive',
  };
}



export function useUserList() {
  const { t } = useI18n();
  const { showError, showSuccess } = useGlobalToast();
  const { openWithController, confirm } = useGlobalDialog();

  const users = ref<User[]>([]);
  const keyword = ref('');
  const loading = ref(false);

  const roleOptions = computed<RoleOption[]>(() => [
    { label: t('user_management.roles.admin'), value: 'admin' },
    { label: t('user_management.roles.manager'), value: 'manager' },
    { label: t('user_management.roles.user'), value: 'user' },
  ]);

  const filteredUsers = computed<User[]>(() => {
    const normalized = keyword.value.trim().toLowerCase();

    if (!normalized) {
      return users.value;
    }

    return users.value.filter((user) => {
      const searchable = [
        String(user.id),
        user.name,
        user.email,
        user.role,
        user.status,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(normalized);
    });
  });

  onMounted(() => {
    fetchUsers();
  });

  onActivated(() => {
    fetchUsers();
  });

  async function fetchUsers() {
    loading.value = true;

    try {
      const response = await fetchUsersApi();
      users.value = response.data;
    } catch (error: unknown) {
      const message = getAxiosErrorMessage(error) || t('api_error_message.unknown');
      showError({ detail: message });
    } finally {
      loading.value = false;
    }
  }

  function openUserDialog(data: Omit<UserDialogData, 'onCancel'>) {
    let controller: DialogController<UserDialogResult> | null = null;

    controller = openWithController<UserDialogData, UserDialogResult>(
      UserListDialog,
      {
        ...data,
        onCancel: () => controller?.cancel(),
        onSubmit: async (form) => {
          const accepted = await data.onSubmit(form);

          if (accepted) {
            controller?.close({ accepted: true });
          }

          return accepted;
        },
      },
      {
        header: data.isEditMode ? t('user_management.edit_user') : t('user_management.add_user'),
        class: 'w-[94vw] max-w-lg',
      },
    );

    return controller.result;
  }

  function openCreateDialog() {
    openUserDialog({
      isEditMode: false,
      form: { ...DEFAULT_USER_FORM },
      roleOptions: roleOptions.value,
      onSubmit: async (form) => {
        const payload = buildUserPayload(form);

        try {
          const createResponse = await createUserApi(payload);

          if (!createResponse.success) {
            throw new Error(createResponse.message || 'create user failed');
          }

          const createdUser = createResponse.data;
          users.value = [createdUser, ...users.value];
          showSuccess({ detail: t('user_management.messages.created') });

          return true;
        } catch (error: unknown) {
          const message = getAxiosErrorMessage(error) || t('api_error_message.unknown');
          showError({ detail: message });
          return false;
        }
      },
    });
  }

  function openEditDialog(user: User) {
    openUserDialog({
      isEditMode: true,
      form: {
        id: user.id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status === 'active',
      },
      roleOptions: roleOptions.value,
      onSubmit: async (form) => {
        if (form.id === null) {
          showError({ detail: t('user_management.messages.save_failed') });
          return false;
        }

        const payload = buildUserPayload(form);

        try {
          const updateResponse = await updateUserApi(form.id, payload);

          const updatedUser = updateResponse.data;
          const targetIndex = users.value.findIndex((row) => row.id === updatedUser.id);

          if (targetIndex !== -1) {
            users.value[targetIndex] = updatedUser;
          }

          showSuccess({ detail: t('user_management.messages.updated') });
          return true;
        } catch (error: unknown) {
          const message = getAxiosErrorMessage(error) || t('api_error_message.unknown');
          showError({ detail: message });
          return false;
        }
      },
    });
  }

  async function confirmDelete(user: User) {
    const accepted = await confirm({
      message: t('user_management.delete_confirm', { name: user.name }),
    });

    if (!accepted) return;

    try {
      const response = await deleteUserApi(user.id);

      if (!response.success) {
        throw new Error(response.message || 'delete user failed');
      }

      users.value = users.value.filter((row) => row.id !== user.id);
      showSuccess({ detail: t('user_management.messages.deleted') });
    } catch (error: unknown) {
      const message = getAxiosErrorMessage(error) || t('api_error_message.unknown');
      showError({ detail: message });
    }
  }

  return {
    keyword,
    loading,
    filteredUsers,
    openCreateDialog,
    openEditDialog,
    confirmDelete,
  };
}
