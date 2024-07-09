import { readFileSync, writeFileSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dataFilePath = join(__dirname, '../data/users.json')

export function createUser({ username, email, password }) {
  const users = getUsersFromFile()
  const hashedPassword = bcrypt.hashSync(password, 10)
  const newUser = {
    _id: uuidv4(),
    username,
    email,
    password: hashedPassword
  }
  users.push(newUser)
  saveUsersToFile(users)
  return newUser
}

export async function findUserByEmailAndPassword(email, password) {
  try {
    const users = getUsersFromFile()
    const user = users.find((user) => user.email === email)
    if (!user) {
      return null
    }
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      return null
    }
    return user
  } catch (error) {
    throw new Error(`Failed to find user by email and password: ${error.message}`)
  }
}

export async function findUserById(id) {
  try {
    const users = getUsersFromFile()
    const user = users.find((user) => user._id === id)
    return user || null
  } catch (error) {
    throw new Error(`Failed to find user by id: ${error.message}`)
  }
}

export async function findUserByEmail(email) {
  try {
    const users = getUsersFromFile()
    const user = users.find((user) => user.email === email)
    return user || null
  } catch (error) {
    throw new Error(`Failed to find user by email: ${error.message}`)
  }
}

function getUsersFromFile() {
  try {
    const data = readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

function saveUsersToFile(users) {
  const data = JSON.stringify(users, null, 2)
  writeFileSync(dataFilePath, data, 'utf-8')
}
