import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

const Todo = mongoose.model('Todo', todoSchema)

export { Todo }
