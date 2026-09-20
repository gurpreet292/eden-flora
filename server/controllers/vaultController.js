import { getDatabase } from '../db.js'
import { rarePlants } from '../data/rarePlants.js'
import { createRarePlantDocument } from '../models/RarePlant.js'

const getCollection = async () => {
  if (!process.env.MONGODB_URI) return null
  try {
    const database = await getDatabase()
    const collection = database.collection('rarePlants')
    if (await collection.countDocuments() === 0) {
      await collection.insertMany(rarePlants.map(createRarePlantDocument))
    }
    return collection
  } catch (error) {
    console.warn(`Vault database unavailable; serving archive seed data. ${error.message}`)
    return null
  }
}

export const listVaultPlants = async (request, response, next) => {
  try {
    const collection = await getCollection()
    const plants = collection ? await collection.find({}).sort({ passportId: 1 }).toArray() : rarePlants
    response.json(plants)
  } catch (error) {
    next(error)
  }
}

export const getVaultPlant = async (request, response, next) => {
  try {
    const collection = await getCollection()
    const plant = collection
      ? await collection.findOne({ id: request.params.id })
      : rarePlants.find((item) => item.id === request.params.id)

    if (!plant) return response.status(404).json({ message: 'Rare plant not found' })
    response.json(plant)
  } catch (error) {
    next(error)
  }
}

export const createVaultPlant = async (request, response, next) => {
  try {
    const collection = await getCollection()
    if (!collection) return response.status(503).json({ message: 'MongoDB is required to add vault plants' })
    const plant = createRarePlantDocument(request.body)
    await collection.insertOne(plant)
    response.status(201).json(plant)
  } catch (error) {
    next(error)
  }
}

export const curateVaultPlant = async (request, response, next) => {
  try {
    const collection = await getCollection()
    const plant = collection
      ? await collection.findOne({ id: request.params.id })
      : rarePlants.find((item) => item.id === request.params.id)
    if (!plant) return response.status(404).json({ message: 'Rare plant not found' })
    const question = String(request.body.question || '').trim()
    let answer = `${plant.name} is a ${plant.rarityLevel.toLowerCase()} specimen from ${plant.origin}. ${plant.description}`
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `You are Eden Flora's botanical curator. Answer in 2-4 concise sentences using only this verified record. Plant: ${plant.name}. Origin: ${plant.origin}. Habitat: ${plant.habitat}. Rarity: ${plant.rarityLevel}. Conservation: ${plant.conservationStatus}. Why rare: ${plant.whyRare}. Why protect: ${plant.whyProtect}. Fun fact: ${plant.funFact}. Visitor question: ${question}` }] }] }),
        })
        if (geminiResponse.ok) {
          const data = await geminiResponse.json()
          const generated = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
          if (generated) return response.json({ answer: generated, source: 'Gemini · Eden Flora botanical archive' })
        }
      } catch (error) {
        console.warn(`Gemini curator unavailable; using archive response. ${error.message}`)
      }
    }
    const normalizedQuestion = question.toLowerCase()
    if (normalizedQuestion.includes('rare') || normalizedQuestion.includes('why')) answer = `${plant.name} is rare because ${plant.whyRare}`
    if (normalizedQuestion.includes('protect') || normalizedQuestion.includes('conserv')) answer = `Protection matters because ${plant.whyProtect} Its current status is ${plant.conservationStatus}.`
    if (normalizedQuestion.includes('fact') || normalizedQuestion.includes('interesting')) answer = `Field note: ${plant.funFact}`
    response.json({ answer, source: 'Eden Flora botanical archive fallback' })
  } catch (error) {
    next(error)
  }
}
