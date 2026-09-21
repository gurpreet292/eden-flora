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
          body: JSON.stringify({ contents: [{ parts: [{ text: `You are Eden Flora's professional plant-care assistant. Inspect only the uploaded plant image. Return exactly these headings: Plant Health Status, Confidence, Leaf observations, Disease or pest detection, Water recommendation, Sunlight recommendation, Fertilizer suggestion, Care reminder. Give a cautious confidence percentage, keep each section to one or two useful sentences, mention uncertainty, and never claim a definitive diagnosis. Additional context: ${context || 'None provided.'}` }, { inline_data: { mime_type: mimeType, data } }] }] }),
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
  return { answer: `Plant Health Status\nUnable to assess reliably from this image.\n\nConfidence\nLow: the image does not provide enough detail for a dependable assessment.\n\nLeaf observations\nCheck for discoloration, curling, spots, pests, and dry edges.\n\nDisease or pest detection\nNo disease or pest diagnosis can be confirmed from this image.\n\nWater recommendation\nCheck the top layer of soil before watering and ensure the pot drains freely.\n\nSunlight recommendation\nUse bright, indirect light and avoid sudden exposure to harsh direct sun.\n\nFertilizer suggestion\nDo not fertilize a stressed plant until its light and watering routine are stable.\n\nCare reminder\nInspect the plant again in 5-7 days and upload a clear close-up if symptoms continue.`, source: 'Eden Flora visual guidance' }
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
    response.json(await generate(`You are Eden Flora's professional botanical editor. Rewrite this plant-care note as a clear, useful care summary. Return exactly these headings: Summary, Care actions, Watch for. Use short sentences and bullet points under the headings. Preserve important cautions and do not invent plant-specific facts:\n\n${content}`, 'Summary\nThis note describes a plant-care routine.\n\nCare actions\n- Follow the timing consistently.\n- Check the plant before changing the routine.\n\nWatch for\n- Adjust gradually when light, soil, or season changes.'))
  } catch (error) {
    next(error)
  }
})

router.post('/docs', async (request, response, next) => {
  try {
    const content = String(request.body?.content || '').trim()
    if (!content || content.length > 10000) return response.status(400).json({ message: 'Code content is required and must be under 10,000 characters.' })
    response.json(await generate(`You are a careful code reviewer. Explain this code for a beginner without inventing missing context. Return exactly these Markdown headings: Purpose, How it works, Important details, Improvement, Safety note. Under How it works, describe the main flow in numbered steps. Mention the relevant functions, inputs, outputs, and likely edge cases when they are visible. Keep it practical and specific:\n\n${content}`, 'Purpose\nThis file contains executable application code.\n\nHow it works\n1. Read the file in small sections and trace its inputs and outputs.\n2. Follow the main success path before checking error handling.\n\nImportant details\n- Confirm the expected data types and external dependencies.\n\nImprovement\n- Add focused tests for the main success and error paths.\n\nSafety note\n- Validate untrusted input at the boundary and avoid exposing secrets.'))
  } catch (error) {
    next(error)
  }
})

router.post('/readme', async (request, response, next) => {
  try {
    const content = String(request.body?.content || '').trim()
    if (!content || content.length > 10000) return response.status(400).json({ message: 'Project content is required and must be under 10,000 characters.' })
    response.json(await generate(`Create a detailed but readable README in Markdown for this shared plant collection. Use only facts present in the supplied material. Include these headings: Overview, Members, Notes and Care Log, Files, Activity Statistics, How to Use This Collection, Configuration and Access. Preserve note titles and their useful content, explain the purpose of uploaded files from their names and types only, and do not invent setup commands or plant facts. If a section has no data, say so clearly.\n\n${content}`, '# Project\n\n## Overview\nA shared plant collection for organizing care information.\n\n## Members\nNo members are listed yet.\n\n## Notes and Care Log\nNo notes have been added yet.\n\n## Files\nNo files have been uploaded yet.\n\n## Activity Statistics\nNo activity statistics are available.\n\n## How to Use This Collection\nAdd care notes, upload reference files, and invite the people who help maintain the plants.\n\n## Configuration and Access\nKeep this collection private unless public sharing is intentionally enabled.'))
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
