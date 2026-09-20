import { Router } from 'express'
import { requireAuth } from './auth.js'

const router = Router()
router.use(requireAuth)

const fallbackAnswer = (question) => {
  const normalizedQuestion = question.toLowerCase()
  if (normalizedQuestion.includes('yellow')) return 'Yellow leaves usually point to overwatering, poor drainage, or a sudden change in light. Check the top few centimetres of soil, make sure the pot drains freely, and remove leaves that are fully yellow.'
  if (normalizedQuestion.includes('water')) return 'Water when the top layer of soil feels dry, then soak the root ball until water drains from the pot. Empty the saucer so the roots do not sit in water.'
  if (normalizedQuestion.includes('light')) return 'Most indoor plants prefer bright, indirect light. Move the plant closer to a window gradually and watch for bleached patches or crispy edges, which can signal too much direct sun.'
  if (normalizedQuestion.includes('care') || normalizedQuestion.includes('plan')) return 'Start with a simple care rhythm: check soil weekly, inspect leaves for pests, rotate the pot for even growth, and note changes in your garden journal.'
  return 'Start by checking the plant’s light, soil moisture, drainage, and leaves for pests. Those four observations usually reveal the next useful care step.'
}

const generate = async (prompt, fallback) => {
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      })
      if (geminiResponse.ok) {
        const data = await geminiResponse.json()
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        if (answer) return { answer, source: 'Gemini · Eden Flora' }
      }
    } catch (error) {
      console.warn(`Gemini generation unavailable; using local response. ${error.message}`)
    }
  }
  return { answer: fallback, source: 'Eden Flora local guidance' }
}

const generateImageAnalysis = async (image, context, fallback) => {
  if (process.env.GEMINI_API_KEY) {
    try {
      const [metadata, data] = String(image).split(',', 2)
      const mimeType = metadata.match(/^data:(.*?);base64$/)?.[1]
      if (mimeType && data) {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `You are Eden Flora's cautious plant-care assistant. Inspect this plant image and describe only visible signs, possible general causes, and safe next checks. Do not claim a definitive diagnosis. Keep it to 4 concise sentences. Additional context: ${context || 'None provided.'}` }, { inline_data: { mime_type: mimeType, data } }] }] }),
        })
        if (geminiResponse.ok) {
          const result = await geminiResponse.json()
          const answer = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
          if (answer) return { answer, source: 'Gemini · Eden Flora image curator' }
        }
      }
    } catch (error) {
      console.warn(`Gemini image analysis unavailable; using local response. ${error.message}`)
    }
  }
  return { answer: fallback, source: 'Eden Flora visual guidance' }
}

router.post('/ask', async (request, response, next) => {
  try {
    const question = String(request.body?.question || '').trim()
    if (question.length < 3 || question.length > 500) return response.status(400).json({ message: 'Ask a question between 3 and 500 characters.' })

    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `You are Eden Flora's practical plant-care assistant. Answer the user's question in 3-5 concise sentences. Give safe, general indoor plant advice, state uncertainty when the plant or symptoms are unclear, and never claim to diagnose disease. User question: ${question}` }] }] }),
        })
        if (geminiResponse.ok) {
          const data = await geminiResponse.json()
          const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
          if (answer) return response.json({ answer, source: 'Gemini · Eden Flora care assistant' })
        }
      } catch (error) {
        console.warn(`Gemini care assistant unavailable; using local guidance. ${error.message}`)
      }
    }

    response.json({ answer: fallbackAnswer(question), source: 'Eden Flora care guidance' })
  } catch (error) {
    next(error)
  }
})

router.post('/explain', async (request, response, next) => {
  try {
    const content = String(request.body?.content || '').trim()
    if (!content || content.length > 10000) return response.status(400).json({ message: 'Note content is required and must be under 10,000 characters.' })
    response.json(await generate(`You are Eden Flora's botanical editor. Explain this plant-care note in plain language in 3 concise sentences, preserving any important cautions:\n\n${content}`, 'This note describes a plant-care routine. Follow its timing consistently, check the plant before changing the routine, and adjust gradually when light, soil, or season changes.'))
  } catch (error) {
    next(error)
  }
})

router.post('/docs', async (request, response, next) => {
  try {
    const content = String(request.body?.content || '').trim()
    if (!content || content.length > 10000) return response.status(400).json({ message: 'Code content is required and must be under 10,000 characters.' })
    response.json(await generate(`You are a careful code reviewer. Explain what this code does, identify one practical improvement, and mention any obvious safety concern. Use concise Markdown and do not invent missing context:\n\n${content}`, 'Review the code in small sections, add a short purpose comment where needed, validate inputs at the boundary, and test the main success and error paths.'))
  } catch (error) {
    next(error)
  }
})

router.post('/readme', async (request, response, next) => {
  try {
    const content = String(request.body?.content || '').trim()
    if (!content || content.length > 10000) return response.status(400).json({ message: 'Project content is required and must be under 10,000 characters.' })
    response.json(await generate(`Create a concise README in Markdown for this project. Include a title, purpose, setup, usage, and notes about configuration. Only use facts present in the supplied material:\n\n${content}`, '# Project\n\n## Overview\nAdd a short description of this project.\n\n## Setup\nDocument installation and configuration steps here.'))
  } catch (error) {
    next(error)
  }
})

router.post('/image', async (request, response, next) => {
  try {
    const image = String(request.body?.image || '')
    const context = String(request.body?.context || '').trim().slice(0, 1000)
    if (!/^data:image\/(jpeg|png|webp);base64,/.test(image) || image.length > 4 * 1024 * 1024) return response.status(400).json({ message: 'Upload a JPEG, PNG, or WebP image smaller than 3 MB.' })
    response.json(await generateImageAnalysis(image, context, 'The image shows a plant, but a reliable diagnosis is not possible from this view. Check the soil moisture, drainage, light exposure, and undersides of leaves, then compare changes over several days.'))
  } catch (error) {
    next(error)
  }
})

export default router
