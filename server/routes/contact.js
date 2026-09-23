import { Router } from 'express'
import { sendContactEmail } from '../services/email.js'

const router = Router()

router.post('/contact', async (request, response, next) => {
  try {
    const { name, email, topic, message } = request.body || {}

    if (![name, email, topic, message].every((value) => typeof value === 'string' && value.trim())) {
      return response.status(400).json({ message: 'Please complete every contact field.' })
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return response.status(400).json({ message: 'Please enter a valid email address.' })
    }

    await sendContactEmail({
      name: name.trim().slice(0, 120),
      email: email.trim().slice(0, 180),
      topic: topic.trim().slice(0, 120),
      message: message.trim().slice(0, 4000),
    })

    return response.status(202).json({ message: 'Your note has been sent.' })
  } catch (error) {
    return next(error)
  }
})

export default router