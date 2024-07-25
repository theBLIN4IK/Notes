import { Task } from '../models/tasks-model.js';

class TaskService {
  async postTask(userId, task) {
    const userTasks = await Task.findOne({ userId })
    if (userTasks) {
      userTasks.tasks.push({ text: task, createdAt: new Date().toISOString() })
      await userTasks.save()
      return userTasks.tasks[userTasks.tasks.length - 1]
    } else {
      const newTask = new Task({
        userId,
        tasks: [{ text: task, createdAt: new Date().toISOString() }]
      });
      await newTask.save()
      return newTask.tasks[0]
    }
  }

  async getTasksByUserId(userId) {
    const tasks = await Task.findOne({ userId })
    if (!tasks) {
      throw new Error('Tasks not found')
    }
    return tasks.tasks
  }

  async deleteTask(taskId) {
    const result = await Task.updateOne({}, { $pull: { tasks: { _id: taskId } } })
    if (result.modifiedCount === 0) {
      throw new Error('Task not deleted')
    }
    return true;
  }

  async updateTask(taskId, userId, text) {
    const userTasks = await Task.findOne({ userId })
    if (!userTasks) {
      throw new Error('Tasks not found')
    }
    const taskIndex = userTasks.tasks.findIndex((task) => task._id.toString() === taskId)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    userTasks.tasks[taskIndex].text = text
    await userTasks.save()
    return true
  }
}

export default new TaskService()
