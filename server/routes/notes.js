import { ObjectId } from 'mongodb'
import { Router } from 'express'
import { getDatabase } from '../db.js'
import { requireAuth } from './auth.js'

const router = Router()

const getProjectForMember = async (database, projectId, userId) => {
  if (!ObjectId.isValid(projectId)) return null
  return database.collection('projects').findOne({
    _id: new ObjectId(projectId),
    $or: [{ ownerId: userId }, { 'members.userId': userId }],
  })
}

router.use(requireAuth)

router.get('/projects/:projectId/notes', async (request, response, next) => {
  try {
    const database = await getDatabase()
    const project = await getProjectForMember(database, request.params.projectId, request.user.id)
    if (!project) return response.status(404).json({ message: 'Project not found.' })
    const notes = await database.collection('notes').find({ projectId: project._id.toString() }).sort({ updatedAt: -1 }).toArray()
    response.json({ notes })
  } catch (error) {
    next(error)
  }
})

router.post('/projects/:projectId/notes', async (request, response, next) => {
  try {
    const title = String(request.body?.title || '').trim()
    const content = String(request.body?.content || '').trim()
    if (!title || title.length > 120) return response.status(400).json({ message: 'A note title is required and must be under 120 characters.' })
    if (!content || content.length > 10000) return response.status(400).json({ message: 'Note content is required and must be under 10,000 characters.' })

    const database = await getDatabase()
    const project = await getProjectForMember(database, request.params.projectId, request.user.id)
    if (!project) return response.status(404).json({ message: 'Project not found.' })

    const now = new Date()
    const note = {
      projectId: project._id.toString(),
      title,
      content,
      author: { id: request.user.id, name: request.user.name },
      createdAt: now,
      updatedAt: now,
    }
    const result = await database.collection('notes').insertOne(note)
    response.status(201).json({ note: { ...note, _id: result.insertedId } })
  } catch (error) {
    next(error)
  }
})

export default router
