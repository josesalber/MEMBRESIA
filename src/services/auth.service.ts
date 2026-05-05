import axios from '../lib/axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },
};
