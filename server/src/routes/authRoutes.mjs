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
      req.flash('error', 'Email already registered.')
      return res.redirect('/register')
    }
    const user = await createUser({ username, email, password })
    req.login(user, (err) => {
      if (err) return next(err)
      return res.redirect('/login')
    })
  } catch (error) {
    req.flash('error', 'Registration failed.')
    res.redirect('/register')
  }
})

authRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      req.flash('error', 'Incorrect email or password, please try again.')
      return res.redirect('/login')
    }
    req.logIn(user, (err) => {
      if (err) return next(err)
      res.redirect('/')
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
