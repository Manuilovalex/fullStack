import { Router } from 'express'
import { passport } from '../config/passport-config.mjs'
import { createUser } from '../services/userService.mjs'
import { forwardAuthenticated } from '../middlewares/authMiddleware.mjs'
import { findUserByEmail } from '../services/userService.mjs'

const authRouter = Router()

authRouter.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login', { error: req.flash('error') })
})

authRouter.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register', { error: req.flash('error') })
})

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

authRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password.' })
    }
    req.logIn(user, (err) => {
      if (err) return next(err)
      res.status(200).json({ message: 'Login successful.' })
    })
  })(req, res, next)
})

authRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

export default authRouter
