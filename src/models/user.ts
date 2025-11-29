export interface User {
  userId: string;
  userName: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  active: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface CreateUserInput {
  userId: string;
  userName: string;
  password: string;
  fullName: string;
  role: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

export interface UpdateUserInput {
  userName?: string;
  password?: string;
  fullName?: string;
  role?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}
