import bcrypt from 'bcryptjs'
import { User } from '../models/datausers.mjs'

export async function createUser({ username, email, password }) {
  const hashedPassword = bcrypt.hashSync(password, 10)
  const newUser = new User({
    username,
    email,
    password: hashedPassword
  })

  await newUser.save()
  return newUser
}

export async function findUserByEmailAndPassword(email, password) {
  const user = await User.findOne({ email }).exec()
  if (!user) {
    return null
  }

  const passwordMatch = bcrypt.compareSync(password, user.password)
  if (!passwordMatch) {
    return null
  }

  return user
}

export async function findUserById(id) {
  const user = await User.findById(id).exec()
  return user
}

export async function findUserByEmail(email) {
  const user = await User.findOne({ email }).exec()
  return user
}
