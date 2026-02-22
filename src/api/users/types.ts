export interface UserPayload {
  avatar: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
}

export interface UserItem extends UserPayload {
  id: number;
}
