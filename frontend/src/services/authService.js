import axios from '@/lib/axios';

export const authService = {
  login: async (credentials) => {
    const payload = {
      username: credentials?.username || credentials?.email,
      password: credentials?.password,
    };
    const data = await axios.post('/auth/login', payload);

    return {
      user: data?.user ? { ...data.user, role: data.user.role?.toLowerCase() } : {
        id: data?.account_id,
        email: data?.username,
        role: data?.role?.toLowerCase(),
      },
      token: data?.token || data?.access_token,
      refreshToken: data?.refresh_token,
    };
  },

  getCurrentUser: async () => {
    const data = await axios.get('/auth/me');
    if (data?.user) {
      return { ...data.user, role: data.user.role?.toLowerCase() };
    }
    return null;
  },
};
