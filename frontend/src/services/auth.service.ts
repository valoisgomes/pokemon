import api from './api';
import Cookies from 'js-cookie';
import { AuthResponse } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    Cookies.set('token', data.accessToken, { expires: 7 });
    return data;
  },

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    Cookies.set('token', data.accessToken, { expires: 7 });
    return data;
  },

  logout() {
    Cookies.remove('token');
  },

  getToken(): string | undefined {
    return Cookies.get('token');
  },
};
