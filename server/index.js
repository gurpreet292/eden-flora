import 'dotenv/config'

import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

import { ensureDatabaseIndexes, getDatabase } from './db.js'
import authRouter from './routes/auth.js'
import ordersRouter from './routes/orders.js'
import productsRouter from './routes/products.js'
import projectsRouter from './routes/projects.js'
import notesRouter from './routes/notes.js'
import attachmentsRouter from './routes/attachments.js'
import vaultRouter from './routes/vault.js'
import dashboardRouter from './routes/dashboard.js'
import aiRouter from './routes/ai.js'

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(helmet())

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json({ limit: '4mb' }))
app.use(cookieParser())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts. Please try again later.',
  },
})

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: process.env.NODE_ENV === 'development' ? 20 : 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Too many password reset attempts. Please try again later.',
  },
})

app.get('/', (request, response) => {
  response.json({
    name: 'Eden Flora API',
    status: 'running',
    endpoints: [
      '/api/health',
      '/api/products',
      '/api/orders',
      '/api/vault',
    ],
  })
})

app.get('/api/health', async (request, response) => {
  try {
    const database = await getDatabase()
    await database.command({ ping: 1 })

    return response.json({
      status: 'ok',
      database: 'connected',
    })
  } catch (error) {
    return response.status(503).json({
      status: 'error',
      database: 'disconnected',
      message: error.message,
    })
  }
})

app.use('/api/auth/register', authLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/request-reset', resetLimiter)
app.use('/api/auth/reset-password', resetLimiter)

app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/projects', projectsRouter)
app.use('/api', notesRouter)
app.use('/api', attachmentsRouter)
app.use('/api/vault', vaultRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/ai', aiRouter)

app.use((error, request, response, _next) => {
  console.error(error)

  return response.status(500).json({
    message: 'Something went wrong on the server',
  })
})

app.listen(port, () => {
  console.log(`Eden Flora API listening on http://localhost:${port}`)

  ensureDatabaseIndexes().catch((error) => {
    console.error(`Database indexes unavailable: ${error.message}`)
  })
})