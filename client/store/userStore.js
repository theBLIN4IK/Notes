import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { PREFIX } from '../src/config/api.config';

export const useUserStore = create((set) => ({
  email: '',
  id: '',
  isAuthenticated: false,
  errorText: null,

  login: async (email, password) => {
    try {
      const { data } = await axios.post(`${PREFIX}/login`, { email, password }, { withCredentials: true });

      set({
        email: data.user.email,
        id: data.user.id,
        isAuthenticated: true,
      })

      return data.accessToken
    }  catch (err) {
			if (err instanceof AxiosError) {
				throw new Error(err.response?.data.message)
			}
		}
  },
  register: async (email, password) => {
    try {
    const { data } = await axios.post(`${PREFIX}/login`, {  email, password  }, { withCredentials: true }) 
    set({
      email: data.user.email,
      id: data.user.id,
      isAuthenticated: true,
    })
    return data.accessToken
    } catch (err) {
    if (err instanceof AxiosError) {
    throw new Error(err.response?.data.message)
    } else if (err.request) {
                    throw new Error('Нет ответа от сервера');
                } else {
                    throw new Error('Ошибка соединения');
                }
    }
    },
    

  checkAuth: async () => {
    try {
      const { data } = await axios.get(`${PREFIX}/checkAuth`, { withCredentials: true });

      set({
        email: data.user.email,
        id: data.user.id,
        isAuthenticated: true,
      })

      return true;
    } catch (err) {
      set({
        email: '',
        id: '',
        isAuthenticated: false,
      });

      return false
    }
  }
}));
