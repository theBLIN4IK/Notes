import { Task } from '../models/tasks-model.js';
import 'dotenv/config';
import { ApiError } from '../exceptions/api-errors.js';



class TaskController {
  async postTask(req, res, next) {
    try {
      const { userId, task } = req.body
      const userTasks = await Task.findOne({ userId })
      if (userTasks) {
        userTasks.tasks.push({ text: task, createdAt: new Date().toISOString() })
        await userTasks.save()
        return res.json({ userTask: userTasks.tasks[userTasks.tasks.length - 1] })
      } else {
        const newTask = new Task({ userId, tasks: [{ text: task, createdAt: new Date().toISOString() }] })
        await newTask.save()
      }
      await userTasks.save()
      return res.json({ message: 'Task added successfully' })
    } catch (error) {
      return next(ApiError.BadRequest('Задача не добавлена'))
    }
  }
  
  async getTasksByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const tasks = await Task.findOne({ userId })
      if (!tasks) {
        return next(ApiError.BadRequest('Задачи не найдены'))
      }
      return res.json(tasks.tasks)
    } catch (error) {
      return next(ApiError.BadRequest('Задачи не найдены'))
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params
      const result = await Task.updateOne({}, { $pull: { tasks: { _id: taskId } } })
      if (result.modifiedCount === 0) {
        return next(ApiError.BadRequest('Задача не удалена'))
      }
      return res.json({ message: 'Task deleted successfully' })
    } catch (error) {
      return next(ApiError.BadRequest('Задача не удалена'))
    }
  }

  async updateTask(req, res, next) {
    try {
      const { taskId } = req.params
      const { userId, text } = req.body
      const userTasks = await Task.findOne({ userId })
      if (!userTasks) {
        return next(ApiError.BadRequest('Задачи не найдены'))
      }
      const taskIndex = userTasks.tasks.findIndex((task) => task._id.toString() === taskId)
      if (taskIndex === -1) {
        return next(ApiError.BadRequest('Задача не найдена'))
      }
      userTasks.tasks[taskIndex].text = text
      await userTasks.save()
      return res.json({ message: 'Task updated successfully!' })
    } catch (error) {
      return next(ApiError.BadRequest('Задача не обновлена'))
    }
  }
}

export default new TaskController()
  