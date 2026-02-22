import { z } from 'zod';

export const userRoleIds = ['admin', 'manager', 'user'] as const;
export const userStatuses = ['active', 'inactive'] as const;

type UserRoleId = (typeof userRoleIds)[number];
type UserStatus = (typeof userStatuses)[number];

function isRequiredValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
}

export const userSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(1, { message: 'v.required' })
    .min(3, { message: 'v.user_name_length' })
    .max(20, { message: 'v.user_name_length' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'v.required' })
    .email({ message: 'v.email_invalid' }),
  roleId: z
    .unknown()
    .refine(isRequiredValue, { message: 'v.required' })
    .refine(
      (value) => typeof value === 'number' || (typeof value === 'string' && userRoleIds.includes(value as UserRoleId)),
      { message: 'v.role_id_invalid' },
    ),
  status: z
    .string()
    .trim()
    .min(1, { message: 'v.required' })
    .refine((value): value is UserStatus => userStatuses.includes(value as UserStatus), {
      message: 'v.status_invalid',
    }),
});

export type UserSchemaInput = z.infer<typeof userSchema>;
