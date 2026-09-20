import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import { Router } from 'express'
import { getDatabase } from '../db.js'
import { requireAuth } from './auth.js'

const router = Router()

router.get('/public/:token', async (request, response, next) => {
  try {
    const database = await getDatabase()
    const project = await database.collection('projects').findOne({ shareToken: request.params.token, isPublic: true })
    if (!project) return response.status(404).json({ message: 'This garden project is private or no longer available.' })

    response.json({
      project: {
        name: project.name,
        description: project.description,
        owner: project.owner?.name || 'Eden Flora gardener',
        memberCount: project.members?.length || 0,
        createdAt: project.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

const projectAccess = (userId) => ({ $or: [{ ownerId: userId }, { 'members.userId': userId }] })

const findProject = async (database, projectId, userId) => {
  if (!ObjectId.isValid(projectId)) return null
  return database.collection('projects').findOne({ _id: new ObjectId(projectId), ...projectAccess(userId) })
}

router.use(requireAuth)

router.get('/', async (request, response, next) => {
  try {
    const database = await getDatabase()
    const projects = await database.collection('projects').find(projectAccess(request.user.id)).sort({ updatedAt: -1 }).toArray()
    response.json({ projects })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (request, response, next) => {
  try {
    const name = String(request.body?.name || '').trim()
    const description = String(request.body?.description || '').trim()
    if (name.length < 2 || name.length > 100) return response.status(400).json({ message: 'Project name must be between 2 and 100 characters.' })

    const now = new Date()
    const project = {
      name,
      description: description.slice(0, 500),
      ownerId: request.user.id,
      owner: { id: request.user.id, name: request.user.name, email: request.user.email },
      members: [{ userId: request.user.id, name: request.user.name, email: request.user.email, role: 'Owner' }],
      plantIds: [],
      createdAt: now,
      updatedAt: now,
    }
    const database = await getDatabase()
    const result = await database.collection('projects').insertOne(project)
    response.status(201).json({ project: { ...project, _id: result.insertedId } })
  } catch (error) {
    next(error)
  }
})

router.post('/:projectId/members', async (request, response, next) => {
  try {
    const email = String(request.body?.email || '').trim().toLowerCase()
    if (!email) return response.status(400).json({ message: 'Member email is required.' })

    const database = await getDatabase()
    const project = await findProject(database, request.params.projectId, request.user.id)
    if (!project) return response.status(404).json({ message: 'Project not found.' })
    if (project.ownerId !== request.user.id) return response.status(403).json({ message: 'Only the project owner can add members.' })

    const member = await database.collection('users').findOne({ email })
    if (!member) return response.status(404).json({ message: 'Create an account for this member before inviting them.' })
    if (project.members.some((item) => item.email === email)) return response.status(409).json({ message: 'That member is already part of this project.' })

    const newMember = { userId: member._id.toString(), name: member.name, email: member.email, role: 'Member' }
    await database.collection('projects').updateOne(
      { _id: project._id },
      { $push: { members: newMember }, $set: { updatedAt: new Date() } },
    )
    response.status(201).json({ member: newMember })
  } catch (error) {
    next(error)
  }
})

router.patch('/:projectId/sharing', async (request, response, next) => {
  try {
    const enabled = request.body?.enabled === true
    const database = await getDatabase()
    const project = await findProject(database, request.params.projectId, request.user.id)
    if (!project) return response.status(404).json({ message: 'Project not found.' })
    if (project.ownerId !== request.user.id) return response.status(403).json({ message: 'Only the project owner can change sharing.' })

    const update = enabled
      ? { isPublic: true, shareToken: project.shareToken || crypto.randomBytes(24).toString('hex') }
      : { isPublic: false, shareToken: null }
    await database.collection('projects').updateOne({ _id: project._id }, { $set: { ...update, updatedAt: new Date() } })
    response.json({ isPublic: update.isPublic, shareToken: update.shareToken })
  } catch (error) {
    next(error)
  }
})

export default router
