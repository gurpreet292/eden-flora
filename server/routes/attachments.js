import { ObjectId } from 'mongodb'
import { Router } from 'express'
import { getDatabase } from '../db.js'
import { requireAuth } from './auth.js'

const router = Router()
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'text/markdown', 'text/javascript', 'text/css', 'application/json'])
const maxFileSize = 2 * 1024 * 1024

const getProjectForMember = async (database, projectId, userId) => {
  if (!ObjectId.isValid(projectId)) return null
  return database.collection('projects').findOne({ _id: new ObjectId(projectId), $or: [{ ownerId: userId }, { 'members.userId': userId }] })
}

router.use(requireAuth)

router.get('/projects/:projectId/attachments', async (request, response, next) => {
  try {
    const database = await getDatabase()
    const project = await getProjectForMember(database, request.params.projectId, request.user.id)
    if (!project) return response.status(404).json({ message: 'Project not found.' })
    const attachments = await database.collection('attachments').find({ projectId: project._id.toString() }).sort({ createdAt: -1 }).project({ data: 0 }).toArray()
    response.json({ attachments })
  } catch (error) {
    next(error)
  }
})

router.get('/projects/:projectId/attachments/:attachmentId', async (request, response, next) => {
  try {
    const database = await getDatabase()
    const project = await getProjectForMember(database, request.params.projectId, request.user.id)
    if (!project || !ObjectId.isValid(request.params.attachmentId)) return response.status(404).json({ message: 'Attachment not found.' })
    const attachment = await database.collection('attachments').findOne({ _id: new ObjectId(request.params.attachmentId), projectId: project._id.toString() })
    if (!attachment) return response.status(404).json({ message: 'Attachment not found.' })
    if (request.query.preview === 'true' && attachment.type.startsWith('text/')) {
      const fileResponse = await fetch(attachment.url)
      if (fileResponse.ok) return response.json({ attachment: { ...attachment, content: (await fileResponse.text()).slice(0, 10000) } })
    }
    response.json({ attachment })
  } catch (error) {
    next(error)
  }
})

router.post('/projects/:projectId/attachments', async (request, response, next) => {
  try {
    const { name, type, data } = request.body || {}
    if (!name || !type || !data || !allowedTypes.has(type)) return response.status(400).json({ message: 'Upload a supported image, PDF, text, Markdown, JSON, JS, or CSS file.' })
    if (typeof data !== 'string' || data.length > maxFileSize * 1.4) return response.status(413).json({ message: 'Files must be smaller than 2 MB.' })

    const database = await getDatabase()
    const project = await getProjectForMember(database, request.params.projectId, request.user.id)
    if (!project) return response.status(404).json({ message: 'Project not found.' })

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_UPLOAD_PRESET) return response.status(503).json({ message: 'Cloudinary uploads are not configured. Add CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET to .env.' })

    const cloudinaryForm = new URLSearchParams({ file: data, upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET, folder: 'eden-flora/collections' })
    const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: cloudinaryForm })
    if (!cloudinaryResponse.ok) {
      const cloudinaryError = await cloudinaryResponse.json().catch(() => ({}))
      const reason = cloudinaryError.error?.message
      return response.status(502).json({ message: reason ? `Cloudinary upload failed: ${reason}` : 'Cloudinary could not store this file. Check your upload preset.' })
    }
    const cloudinaryFile = await cloudinaryResponse.json()
    const attachment = { projectId: project._id.toString(), name: String(name).slice(0, 160), type, size: cloudinaryFile.bytes || Math.round(data.length * 0.75), url: cloudinaryFile.secure_url, publicId: cloudinaryFile.public_id, uploadedBy: { id: request.user.id, name: request.user.name }, createdAt: new Date() }
    const result = await database.collection('attachments').insertOne(attachment)
    response.status(201).json({ attachment: { ...attachment, _id: result.insertedId } })
  } catch (error) {
    next(error)
  }
})

export default router
