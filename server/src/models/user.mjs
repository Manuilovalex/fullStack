import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true }
})

export const User = mongoose.model('User', userSchema)
