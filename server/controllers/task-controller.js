import { ApiError } from '../exceptions/api-errors.js';
import TaskService from '../services/task-service.js'; 

class TaskController {
  async postTask(req, res, next) {
    try {
      const { userId, task } = req.body
      const userTask = await TaskService.postTask(userId, task)
      return res.json({ userTask })
    } catch (error) {
      return next(ApiError.BadRequest('Задача не создана'))
    }
  }

  async getTasksByUserId(req, res, next) {
    try {
      const { userId } = req.params
      const tasks = await TaskService.getTasksByUserId(userId)
      return res.json(tasks)
    } catch (error) {
      return next(ApiError.BadRequest('Задачи не найдены'))
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params
      await TaskService.deleteTask(taskId)
      return res.json({ message: 'Задача удалена успешно!' })
    } catch (error) {
      return next(ApiError.BadRequest('Задача не удалена'))
    }
  }

  async updateTask(req, res, next) {
    try {
      const { taskId } = req.params
      const { userId, text } = req.body
      await TaskService.updateTask(taskId, userId, text)
      return res.json({ message: 'Задача обновлена успешно!' })
    } catch (error) {
      return next(ApiError.BadRequest('Задача не обновлена'))
    }
  }
}

export default new TaskController()
