import { Router } from 'express'
import passport from 'passport'
import { createUser, findUserByEmail, findUserByEmailAndPassword } from '../services/userService.mjs'
import { forwardAuthenticated } from '../middlewares/authMiddleware.mjs'

const authRouter = Router()

authRouter.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' })
    }

    const user = await createUser({ username, email, password })
    req.login(user, (err) => {
      if (err) return next(err)
      return res.status(200).json({ message: 'Registration successful.' })
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.' })
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await findUserByEmailAndPassword(email, password)
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    req.login(user, (err) => {
      if (err) return next(err)
      return res.status(200).json({ message: 'Login successful.' })
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed.' })
  }
})

export default authRouter
