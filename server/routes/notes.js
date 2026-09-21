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

router.patch('/projects/:projectId/notes/:noteId', async (request, response, next) => {
  try {
    const title = String(request.body?.title || '').trim()
    const content = String(request.body?.content || '').trim()
    if (!title || title.length > 120) return response.status(400).json({ message: 'A note title is required and must be under 120 characters.' })
    if (!content || content.length > 10000) return response.status(400).json({ message: 'Note content is required and must be under 10,000 characters.' })
    if (!ObjectId.isValid(request.params.noteId)) return response.status(404).json({ message: 'Note not found.' })

    const database = await getDatabase()
    const project = await getProjectForMember(database, request.params.projectId, request.user.id)
    if (!project) return response.status(404).json({ message: 'Project not found.' })
    const note = await database.collection('notes').findOne({ _id: new ObjectId(request.params.noteId), projectId: project._id.toString() })
    if (!note) return response.status(404).json({ message: 'Note not found.' })
    if (note.author?.id !== request.user.id && project.ownerId !== request.user.id) return response.status(403).json({ message: 'Only the note author or project owner can edit this note.' })

    const updatedAt = new Date()
    await database.collection('notes').updateOne({ _id: note._id }, { $set: { title, content, updatedAt } })
    response.json({ note: { ...note, title, content, updatedAt } })
  } catch (error) {
    next(error)
  }
})

router.delete('/projects/:projectId/notes/:noteId', async (request, response, next) => {
  try {
    if (!ObjectId.isValid(request.params.noteId)) return response.status(404).json({ message: 'Note not found.' })
    const database = await getDatabase()
    const project = await getProjectForMember(database, request.params.projectId, request.user.id)
    if (!project) return response.status(404).json({ message: 'Project not found.' })
    const note = await database.collection('notes').findOne({ _id: new ObjectId(request.params.noteId), projectId: project._id.toString() })
    if (!note) return response.status(404).json({ message: 'Note not found.' })
    if (note.author?.id !== request.user.id && project.ownerId !== request.user.id) return response.status(403).json({ message: 'Only the note author or project owner can delete this note.' })

    await database.collection('notes').deleteOne({ _id: note._id })
    response.json({ deleted: true, noteId: request.params.noteId })
  } catch (error) {
    next(error)
  }
})

export default router
