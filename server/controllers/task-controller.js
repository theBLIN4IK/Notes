import { Task } from '../models/tasks-model.js';
import 'dotenv/config';



class TaskController {
  async postTask(req, res, next) {
    try {
      const { userId, task } = req.body;
      const userTasks = await Task.findOne({ userId });
      if (userTasks) {
        userTasks.tasks.push({ text: task, createdAt: new Date().toISOString() });
        await userTasks.save();
        return res.json({ userTask: userTasks.tasks[userTasks.tasks.length - 1] });
      } else {
        const newTask = new Task({ userId, tasks: [{ text: task, createdAt: new Date().toISOString() }] });
        await newTask.save();
      }
      await userTasks.save();
      return res.json({ message: 'Task added successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  async getTasksByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const tasks = await Task.findOne({ userId })
      if (!tasks) {
        return res.status(404).json({ message: 'No tasks found for this user' });
      }
      return res.json(tasks.tasks)
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const result = await Task.updateOne({}, { $pull: { tasks: { _id: taskId } } });
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'No task found with this ID' });
      }
      return res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateTask(req, res, next) {
    try {
      const { taskId } = req.params
      const { userId, text } = req.body
      const userTasks = await Task.findOne({ userId })
      if (!userTasks) {
        return res.status(404).json({ message: 'User tasks not found' })
      }
      const taskIndex = userTasks.tasks.findIndex((task) => task._id.toString() === taskId)
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' })
      }
      userTasks.tasks[taskIndex].text = text
      await userTasks.save()
      return res.json({ message: 'Task updated successfully!' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export default new TaskController()
  