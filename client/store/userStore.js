import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { PREFIX } from '../src/config/api.config';

export const useUserStore = create((set) => ({
  email: '',
  id: '',
  isAuthenticated: false,
  userAvatar: null,
  name: '',
  user: {},
//тут был мерлин
  login: async (email, password) => {
    try {
      const { data } = await axios.post(`${PREFIX}/api/login`, { email, password }, { withCredentials: true });
      set({
        email: data.user.email,
        id: data.user.id,
        isAuthenticated: true,
        user: data.user
      });
      return data.accessToken;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data.message);
      } else if (err.request) {
        throw new Error('Нет ответа от сервера');
      } else {
        throw new Error('Ошибка соединения');
      }
    }
  },

  register: async (email, password) => {
    try {
      const { data } = await axios.post(`${PREFIX}/api/registration`, { email, password }, { withCredentials: true });
      set({
        email: data.user.email,
        id: data.user.id,
        isAuthenticated: true,
        user: data.user
      });
      return data.accessToken;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data.message);
      } else if (err.request) {
        throw new Error('Нет ответа от сервера');
      } else {
        throw new Error('Ошибка соединения');
      }
    }
  },

  setAvatar: async (avatar) => {
    try {
      const { data } = await axios.post(`${PREFIX}/api/setAvatar`, avatar, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      set({
        userAvatar: `${PREFIX}/${data.user}`
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data.message);
      } else if (err.request) {
        throw new Error('Нет ответа от сервера');
      } else {
        throw new Error('Ошибка соединения');
      }
    }
  },


  fetchUser: async (email) => {
    try {
      const response = await axios.get(`${PREFIX}/api/getUser/${email}`);
      set({
        user: response.data
      });
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data.message);
      } else if (err.request) {
        throw new Error('Нет ответа от сервера');
      } else {
        throw new Error('Ошибка соединения');
      }
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await axios.put(`${PREFIX}/api/updateUser/${id}`, data);
      set((state) => ({
        user: { ...state.user, ...data }
      }));
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data.message);
      } else if (err.request) {
        throw new Error('Нет ответа от сервера');
      } else {
        throw new Error('Ошибка соединения');
      }
    }
  },

  logout: async () => {
    try {
      await axios.get(`${PREFIX}/api/logout`, { withCredentials: true });
      set({
        email: '',
        id: '',
        isAuthenticated: false,
        user: {}
      });
      return true;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data.message);
      } else if (err.request) {
        throw new Error('Нет ответа от сервера');
      } else {
        throw new Error('Ошибка соединения');
      }
    }
  },
  checkAuth: async () => {
    try {
      const { data } = await axios.get(`${PREFIX}/api/checkAuth`, { withCredentials: true });
      set({
        email: data.user.email,
        id: data.user.id,
        isAuthenticated: true,
        user: data.user
      });
      return true;
    } catch (err) {
      set({
        email: '',
        id: '',
        isAuthenticated: false,
      });
      return false;
    }
  },
}));
