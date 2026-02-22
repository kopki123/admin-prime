export type UserRole = 'admin' | 'manager' | 'user';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: number;
  avatar: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserForm {
  id: number | null;
  avatar: string;
  name: string;
  email: string;
  role: UserRole;
  status: boolean;
}

export interface RoleOption {
  label: string;
  value: UserRole;
}

export interface UserPayload {
  avatar: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserDialogData {
  isEditMode: boolean;
  form: UserForm;
  roleOptions: RoleOption[];
  onSubmit: (form: UserForm) => boolean | Promise<boolean>;
  onCancel: () => void;
}

export interface UserDialogResult {
  accepted?: boolean;
}
