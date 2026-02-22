import { delay, http, HttpResponse } from 'msw';

interface ApiResponseBody<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

interface LoginRequestBody {
  email?: string;
  password?: string;
}

interface UserRequestBody {
  avatar?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

type UserRole = 'admin' | 'manager' | 'user';

interface MockUser {
  id: number;
  avatar: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
}

const mockUser = {
  user_id: 1,
  username: 'admin',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=admin',
};

const mockPermissions = ['sys:user:view', 'sys:user:create', 'sys:user:update', 'sys:user:delete'];

const mockRoles = [
  {
    role_id: 1,
    role_name: 'admin',
    permissions: ['sys:user:view', 'sys:user:create', 'sys:user:update', 'sys:user:delete'],
    is_active: true,
  },
  {
    role_id: 2,
    role_name: 'manager',
    permissions: ['sys:user:view'],
    is_active: true,
  },
  {
    role_id: 3,
    role_name: 'viewer',
    permissions: ['sys:user:view'],
    is_active: true,
  },
];

const mockUsers: MockUser[] = [
  {
    id: 1001,
    avatar: 'https://i.pravatar.cc/80?img=11',
    name: 'Olivia Brown',
    email: 'olivia.brown@dashboard.dev',
    role: 'admin',
    status: 'active',
  },
  {
    id: 1002,
    avatar: 'https://i.pravatar.cc/80?img=33',
    name: 'Ethan Chen',
    email: 'ethan.chen@dashboard.dev',
    role: 'manager',
    status: 'active',
  },
  {
    id: 1003,
    avatar: 'https://i.pravatar.cc/80?img=49',
    name: 'Mia Johnson',
    email: 'mia.johnson@dashboard.dev',
    role: 'user',
    status: 'inactive',
  },
  {
    id: 1004,
    avatar: 'https://i.pravatar.cc/80?img=19',
    name: 'Noah Wilson',
    email: 'noah.wilson@dashboard.dev',
    role: 'user',
    status: 'active',
  },
  {
    id: 1005,
    avatar: 'https://i.pravatar.cc/80?img=55',
    name: 'Sophia Lee',
    email: 'sophia.lee@dashboard.dev',
    role: 'manager',
    status: 'active',
  },
  {
    id: 1006,
    avatar: 'https://i.pravatar.cc/80?img=6',
    name: 'Liam Wang',
    email: 'liam.wang@dashboard.dev',
    role: 'user',
    status: 'inactive',
  },
];

let isLoggedIn = false;
let nextMockUserId = Math.max(...mockUsers.map((item) => item.id));

function parseRole(role: string | undefined): UserRole {
  if (role === 'admin' || role === 'manager' || role === 'user') {
    return role;
  }

  return 'user';
}

function parseStatus(status: string | undefined): 'active' | 'inactive' {
  return status === 'inactive' ? 'inactive' : 'active';
}

function success<T>(data: T, message = 'ok', code = 200, meta?: Record<string, unknown>) {
  const body: ApiResponseBody<T> = {
    success: true,
    code,
    message,
    data,
  };

  if (meta) {
    body.meta = meta;
  }

  return HttpResponse.json<ApiResponseBody<T>>(body, { status: 200 });
}

function failure(code: number, message: string, status = code): HttpResponse<ApiResponseBody<any>> {
  return HttpResponse.json<ApiResponseBody<any>>(
    {
      success: false,
      code,
      message,
      data: null,
    },
    { status },
  );
}

export const handlers = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    await delay(600);

    let body: LoginRequestBody = {};

    try {
      body = (await request.json()) as LoginRequestBody;
    } catch {
      // ignore invalid json body
    }

    const account = (body.email || '').trim().toLowerCase();
    const password = body.password || '';
    const isValidAccount = account === 'admin' || account === 'admin@gmail.com';
    const isValidPassword = password === '123456';

    if (!isValidAccount || !isValidPassword) {
      return failure(401, 'invalid username or password', 401);
    }

    isLoggedIn = true;

    return success(
      {
        access_token: 'mock_access_token_admin',
        refresh_token: 'mock_refresh_token_admin',
      },
      'login success',
      200,
    );
  }),

  http.post('/api/v1/auth/logout', async () => {
    await delay(600);

    isLoggedIn = false;

    return success(true, 'logout success', 200);
  }),

  http.get('/api/v1/auth/status', async () => {
    await delay(600);

    if (!isLoggedIn) {
      return failure(401, 'unauthorized', 401);
    }

    return success(mockUser, 'status success', 200);
  }),

  http.get('/api/v1/my/permissions', async () => {
    await delay(600);

    if (!isLoggedIn) {
      return failure(401, 'unauthorized', 401);
    }

    return success(mockPermissions, 'permissions success', 200);
  }),

  http.get('/api/v1/roles', async () => {
    await delay(600);

    return success(mockRoles, 'roles success', 200, {
      total: mockRoles.length,
    });
  }),

  http.get('/api/v1/users', async () => {
    await delay(600);

    return success(mockUsers, 'users success', 200, {
      total: mockUsers.length,
    });
  }),

  http.post('/api/v1/users', async ({ request }) => {
    await delay(600);

    let body: UserRequestBody;

    try {
      body = (await request.json()) as UserRequestBody;
    } catch {
      return failure(400, 'invalid request body', 400);
    }

    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();

    if (!name || !email) {
      return failure(400, 'name and email are required', 400);
    }

    nextMockUserId += 1;

    const createdUser: MockUser = {
      id: nextMockUserId,
      avatar: body.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
      name,
      email,
      role: parseRole(body.role),
      status: parseStatus(body.status),
    };

    mockUsers.unshift(createdUser);

    return success(
      createdUser,
      'create user success',
      200,
    );
  }),

  http.put('/api/v1/users/:id', async ({ params, request }) => {
    await delay(600);

    const id = Number(params.id);

    if (!Number.isInteger(id)) {
      return failure(400, 'invalid user id', 400);
    }

    const targetIndex = mockUsers.findIndex((item) => item.id === id);

    if (targetIndex === -1) {
      return failure(404, 'user not found', 404);
    }

    let body: UserRequestBody;

    try {
      body = (await request.json()) as UserRequestBody;
    } catch {
      return failure(400, 'invalid request body', 400);
    }

    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();

    if (!name || !email) {
      return failure(400, 'name and email are required', 400);
    }

    const updatedUser: MockUser = {
      id,
      avatar: body.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
      name,
      email,
      role: parseRole(body.role),
      status: parseStatus(body.status),
    };

    mockUsers[targetIndex] = updatedUser;

    return success(updatedUser, 'update user success', 200);
  }),

  http.delete('/api/v1/users/:id', async ({ params }) => {
    await delay(600);

    const id = Number(params.id);

    if (!Number.isInteger(id)) {
      return failure(400, 'invalid user id', 400);
    }

    const targetIndex = mockUsers.findIndex((item) => item.id === id);

    if (targetIndex === -1) {
      return failure(404, 'user not found', 404);
    }

    mockUsers.splice(targetIndex, 1);

    return success(true, 'delete user success', 200, { id });
  }),
];
