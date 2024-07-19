import express from 'express'
import cors from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'
import passport from './config/passport-config.mjs'
import authRouter from './routes/authRoutes.mjs'
import { errorHandler } from './middlewares/errorHandler.mjs'
import { logger } from './middlewares/logger.mjs'
import { ensureAuthenticated } from './middlewares/authMiddleware.mjs'
import usersRouter from './routes/users.mjs'
import postsRouter from './routes/posts.mjs'
import todosRouter from './routes/todos.mjs'
import productsRouter from './routes/products.mjs'
import { connectDB } from './config/mongoConfig.mjs'
import dotenv from 'dotenv'
import MongoStore from 'connect-mongo'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.use(morgan('dev'))
app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(join(__dirname, 'public')))

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success')
  res.locals.error_messages = req.flash('error')
  next()
})

app.use((req, res, next) => {
  console.log('Current session:', req.session)
  console.log('Current user:', req.user)
  next()
})

app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

app.use(authRouter)

app.post('/login', (req, res) => {
  const token = 'someAuthToken'
  res.cookie('token', token, { httpOnly: true, secure: true })
  res.status(200).send({ message: 'Logged in successfully' })
})

app.post('/register', (req, res) => {
  const token = 'someAuthToken'
  res.cookie('token', token, { httpOnly: true, secure: true })
  res.status(200).send({ message: 'Registered successfully' })
})

app.use('/users', ensureAuthenticated, usersRouter)
app.use('/posts', ensureAuthenticated, postsRouter)
app.use('/todos', todosRouter)
app.use('/products', productsRouter)

app.get('/', (req, res) => {
  console.log('User:', req.user)
  console.log('Session:', req.session)
  res.render('index', { user: req.user })
})

app.use((req, res, next) => {
  console.log('MongoDB session store:', req.sessionStore)
  next()
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
