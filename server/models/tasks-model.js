import { Schema, model } from 'mongoose'

const taskSchema = new Schema({
  userId: String,
  tasks: [
    {
      text: String,
      createdAt: String
    }
  ]
})
export const Task = model('Task', taskSchema)
