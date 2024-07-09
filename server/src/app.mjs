import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'
import ejs from 'ejs'
import pug from 'pug'
import { passport } from './config/passport-config.mjs'
import authRouter from './routes/authRoutes.mjs'
import { errorHandler } from './middlewares/errorHandler.mjs'
import { logger } from './middlewares/logger.mjs'
import { ensureAuthenticated } from './middlewares/authMiddleware.mjs'
import usersRouter from './routes/users.mjs'
import articlesRouter from './routes/articles.mjs'
import { connectDB } from './config/mongoConfig.mjs'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(morgan('dev'))
app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(join(__dirname, '../../client/dist')))

app.set('views', join(__dirname, 'views'))
app.engine('ejs', ejs.renderFile)
app.engine('pug', pug.renderFile)
app.set('view engine', 'ejs')

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
)

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success')
  res.locals.error_messages = req.flash('error')
  next()
})

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.theme = req.cookies.theme || 'light'
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  res.locals.user = req.user || null
  next()
})

app.use((req, res, next) => {
  console.log('Current session:', req.session)
  console.log('Current user:', req.user)
  next()
})

app.use(authRouter)

app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

app.use('/users', ensureAuthenticated, usersRouter)
app.use('/articles', ensureAuthenticated, articlesRouter)

app.get('/', (req, res) => {
  console.log('User:', req.user)
  console.log('Session:', req.session)
  res.render('index', { user: req.user })
})

app.post('/theme', (req, res) => {
  const { theme } = req.body
  res.cookie('theme', theme, { maxAge: 900000, httpOnly: true })
  req.session.theme = theme
  res.redirect('back')
})

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../client/dist', 'index.html'))
})

app.use((req, res, next) => {
  const error = new Error('Route not found')
  error.status = 404
  next(error)
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
