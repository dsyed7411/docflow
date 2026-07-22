import { api } from './api';
import { AuthResponse, Profile } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  async getProfile(): Promise<Profile> {
    const response = await api.get<Profile>('/api/profile');
    return response.data;
  },
};
