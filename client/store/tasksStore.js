import { create } from 'zustand';

export const useTasksStore = create((set) => ({
  tasks: [],

  addTaskToStore: (task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },
  updateTaskInStore: (updatedTask) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      ),
    }));
  },
  deleteTaskFromStore: (taskToDelete) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== taskToDelete._id),
    }));
  },
  getTasks: (userTasks) => {
    set((state) => ({
      tasks: userTasks,
    }));
  },
}));
