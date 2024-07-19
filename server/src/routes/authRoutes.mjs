import { Router } from 'express'
import { createUser, findUserByEmail } from '../services/userService.mjs'
import passport from 'passport'

const authRouter = Router()

authRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(409).send('Invalid email or password, try again or register.')
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      console.log('User logged in successfully:', user)
      return res.status(200).send('User logged in successfully')
    })
  })(req, res, next)
})

authRouter.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return res.status(400).send({ message: 'Email already registered.' })
    }

    const user = await createUser({ username, email, password })
    req.login(user, (err) => {
      if (err) return next(err)
      console.log('User registered and logged in, session:', req.session)
      return res.status(200).send({ message: 'Registration successful.', user })
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.' })
  }
})
export default authRouter
