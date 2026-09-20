import { Router } from 'express'
import { getDatabase } from '../db.js'
import { requireAuth } from './auth.js'

const router = Router()
router.use(requireAuth)

router.get('/analytics', async (request, response, next) => {
  try {
    const database = await getDatabase()
    const projects = await database.collection('projects').find({ $or: [{ ownerId: request.user.id }, { 'members.userId': request.user.id }] }).project({ _id: 1 }).toArray()
    const projectIds = projects.map((project) => project._id.toString())
    const [notes, files, noteAuthors, fileAuthors] = await Promise.all([
      database.collection('notes').countDocuments({ projectId: { $in: projectIds } }),
      database.collection('attachments').countDocuments({ projectId: { $in: projectIds } }),
      database.collection('notes').aggregate([{ $match: { projectId: { $in: projectIds } } }, { $group: { _id: '$author.id', name: { $first: '$author.name' }, notes: { $sum: 1 } } }]).toArray(),
      database.collection('attachments').aggregate([{ $match: { projectId: { $in: projectIds } } }, { $group: { _id: '$uploadedBy.id', name: { $first: '$uploadedBy.name' }, files: { $sum: 1 } } }]).toArray(),
    ])
    const contributionMap = new Map()
    noteAuthors.forEach((author) => contributionMap.set(author._id, { name: author.name, notes: author.notes, files: 0 }))
    fileAuthors.forEach((author) => contributionMap.set(author._id, { ...(contributionMap.get(author._id) || { name: author.name, notes: 0 }), files: author.files }))

    response.json({
      projects: projectIds.length,
      notes,
      files,
      careUpdates: notes,
      contributions: projectIds.length + notes + files,
      contributors: [...contributionMap.values()].map((contributor) => ({ ...contributor, total: contributor.notes + contributor.files })),
    })
  } catch (error) {
    next(error)
  }
})

export default router
