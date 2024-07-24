import { create } from 'zustand';
import axios, { AxiosError } from 'axios';

export const useTasksStore = create((set) => ({
  tasks: [],
  loading: false,

  fetchTasks: async (userId) => {
    set({ loading: true })
    try {
      const response = await axios.get(`http://localhost:3000/api/tasks/${userId}`)
      set({ tasks: response.data, loading: false })
    } catch (err) {
      set({ loading: false })
        if (err instanceof AxiosError) {
        throw new Error(err.response?.data.message)
        } else if (err.request) {
                        throw new Error('Нет ответа от сервера')
                    } else {
                        throw new Error('Ошибка соединения')
                    }
        }
  },
  addTaskToStore: async (userId, taskText) => {
    try {
      const response = await axios.post('http://localhost:3000/api/postTask', { userId, task: taskText })
      set((state) => ({
        tasks: [...state.tasks, {
          ...response.data,
          text: taskText,
          createdAt: response.data.userTask.createdAt,
          _id: response.data.userTask._id,
        }],
      }));
    } catch (err) {
      if (err instanceof AxiosError) {
      throw new Error(err.response?.data.message)
      } else if (err.request) {
                      throw new Error('Нет ответа от сервера')
                  } else {
                      throw new Error('Ошибка соединения')
                  }
      }
  },
  updateTaskInStore: async (userId, updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/updateTask/${updatedTask._id}`, {
        userId: userId,
        text: updatedTask.text,
      });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === updatedTask._id ? { ...task, text: updatedTask.text } : task
        ),
      }));
    } catch (err) {
      if (err instanceof AxiosError) {
      throw new Error(err.response?.data.message)
      } else if (err.request) {
                      throw new Error('Нет ответа от сервера')
                  } else {
                      throw new Error('Ошибка соединения')
                  }
      }
  },
  deleteTaskFromStore: async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/api/deleteTask/${taskId}`)
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
      }))
    } catch (err) {
      if (err instanceof AxiosError) {
      throw new Error(err.response?.data.message)
      } else if (err.request) {
                      throw new Error('Нет ответа от сервера')
                  } else {
                      throw new Error('Ошибка соединения')
                  }
      }
  },
}))
