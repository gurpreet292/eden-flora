import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { Router } from 'express'
import { getDatabase } from '../db.js'
import { sendPasswordResetEmail } from '../services/email.js'

const router = Router()
const localUsers = new Map()
const jwtSecret = process.env.JWT_SECRET || 'eden-flora-dev-secret'
const minimumPasswordLength = 8
const authCookieName = 'eden_flora_session'

const isMongoConfigured = () => {
  const uri = process.env.MONGODB_URI
  return Boolean(uri && !uri.includes('<') && !uri.includes('://<'))
}

const normalizeEmail = (email = '') => String(email).trim().toLowerCase()

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validatePassword = (password) => typeof password === 'string'
  && password.length >= minimumPasswordLength
  && /[A-Za-z]/.test(password)
  && /\d/.test(password)

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

const usersCollection = async () => {
  const database = await getDatabase()
  return database.collection('users')
}

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
})

const createToken = (user) => jwt.sign(
  { sub: user._id.toString(), email: user.email, name: user.name },
  jwtSecret,
  { expiresIn: '7d' },
)

const findUserByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email)

  if (!isMongoConfigured()) {
    return localUsers.get(normalizedEmail) || null
  }

  const collection = await usersCollection()
  return collection.findOne({ email: normalizedEmail })
}

const findUserById = async (id) => {
  if (!isMongoConfigured()) {
    for (const user of localUsers.values()) {
      if (user._id.toString() === String(id)) return user
    }
    return null
  }

  const collection = await usersCollection()
  return collection.findOne({ _id: new ObjectId(String(id)) })
}

const insertUser = async ({ name, email, passwordHash, createdAt }) => {
  if (!isMongoConfigured()) {
    const user = {
      _id: { toString: () => `local-${Date.now()}` },
      name,
      email,
      password: passwordHash,
      createdAt,
    }

    localUsers.set(email, user)
    return user
  }

  const collection = await usersCollection()
  const result = await collection.insertOne({
    name,
    email,
    password: passwordHash,
    createdAt,
    resetToken: null,
    resetTokenExpires: null,
  })

  return collection.findOne({ _id: result.insertedId })
}

const findUserByResetToken = async (token) => {
  const tokenHash = hashResetToken(token)

  if (!isMongoConfigured()) {
    for (const user of localUsers.values()) {
      if (user.resetToken === tokenHash && new Date(user.resetTokenExpires).getTime() > Date.now()) {
        return user
      }
    }
    return null
  }

  const collection = await usersCollection()
  return collection.findOne({
    resetToken: tokenHash,
    resetTokenExpires: { $gt: new Date() },
  })
}

const setResetTokenForUser = async (user, token) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
  const tokenHash = hashResetToken(token)

  if (!isMongoConfigured()) {
    user.resetToken = tokenHash
    user.resetTokenExpires = expiresAt
    return
  }

  const collection = await usersCollection()
  await collection.updateOne(
    { _id: user._id },
    { $set: { resetToken: tokenHash, resetTokenExpires: expiresAt } },
  )
}

export const requireAuth = async (request, response, next) => {
  const authHeader = request.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : request.cookies?.[authCookieName]

  if (!token) {
    return response.status(401).json({ message: 'Authentication required.' })
  }

  try {
    const payload = jwt.verify(token, jwtSecret)
    const user = await findUserById(payload.sub)

    if (!user) {
      return response.status(401).json({ message: 'User not found.' })
    }

    request.user = sanitizeUser(user)
    next()
  } catch {
    response.status(401).json({ message: 'Invalid or expired token.' })
  }
}

const setAuthCookie = (response, user) => response.cookie(authCookieName, createToken(user), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

router.post('/register', async (request, response, next) => {
  try {
    const { name, email, password } = request.body ?? {}

    if (!name?.trim() || name.trim().length < 2 || name.trim().length > 80 || !email?.trim() || !password) {
      return response.status(400).json({ message: 'Name, email, and password are required.' })
    }

    const normalizedEmail = normalizeEmail(email)

    if (!isValidEmail(normalizedEmail)) {
      return response.status(400).json({ message: 'Please provide a valid email address.' })
    }

    if (!validatePassword(password)) {
      return response.status(400).json({ message: 'Password must be at least 8 characters and include a letter and a number.' })
    }

    const existingUser = await findUserByEmail(normalizedEmail)

    if (existingUser) {
      return response.status(409).json({ message: 'An account with this email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const createdAt = new Date()
    const user = await insertUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashedPassword,
      createdAt,
    })

    response.status(201).json({
      message: 'Account created successfully.',
      user: sanitizeUser(user),
    })
    setAuthCookie(response, user)
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (request, response, next) => {
  try {
    const { email, password } = request.body ?? {}

    if (!email?.trim() || !password) {
      return response.status(400).json({ message: 'Email and password are required.' })
    }

    const normalizedEmail = normalizeEmail(email)

    if (!isValidEmail(normalizedEmail)) {
      return response.status(400).json({ message: 'Please provide a valid email address.' })
    }

    const user = await findUserByEmail(normalizedEmail)

    if (!user) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    response.json({
      message: 'Logged in successfully.',
      user: sanitizeUser(user),
    })
    setAuthCookie(response, user)
  } catch (error) {
    next(error)
  }
})

router.get('/me', requireAuth, async (request, response) => {
  response.json({ user: request.user })
})

router.post('/logout', (request, response) => {
  response.clearCookie(authCookieName, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
  response.json({ message: 'Logged out successfully.' })
})

router.post('/request-reset', async (request, response) => {
  const { email } = request.body ?? {}

  if (!email?.trim()) {
    return response.status(400).json({ message: 'Email is required.' })
  }

  const normalizedEmail = normalizeEmail(email)
  const user = await findUserByEmail(normalizedEmail)

  if (!user) {
    return response.json({
      message: 'If an account exists for that email, a reset link has been sent.',
    })
  }

  const token = crypto.randomBytes(32).toString('hex')
  await setResetTokenForUser(user, token)
  await sendPasswordResetEmail({ email: normalizedEmail, token })

  response.json({
    message: 'If an account exists for that email, a reset link has been sent.',
  })
})

router.post('/reset-password', async (request, response) => {
  const { token, password } = request.body ?? {}

  if (!token || !validatePassword(password)) {
    return response.status(400).json({
      message: 'A valid reset token and a password of at least 8 characters with a letter and a number are required.',
    })
  }

  const resetUser = await findUserByResetToken(token)

  if (!resetUser) {
    return response.status(400).json({ message: 'This reset link is invalid or has expired.' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  if (!isMongoConfigured()) {
    resetUser.password = hashedPassword
    delete resetUser.resetToken
    delete resetUser.resetTokenExpires
  } else {
    const collection = await usersCollection()
    await collection.updateOne(
      { _id: resetUser._id },
      { $set: { password: hashedPassword, resetToken: null, resetTokenExpires: null } },
    )
  }

  response.json({ message: 'Password reset successfully. You can now sign in.' })
})

export default router
