import { MongoClient } from 'mongodb'

let clientPromise

export const getDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured')
  }

  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI)
    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined
      throw error
    })
  }

  const client = await clientPromise
  return client.db(process.env.MONGODB_DB || 'eden_flora')
}

export const ensureDatabaseIndexes = async () => {
  const database = await getDatabase()
  await database.collection('users').createIndex({ email: 1 }, { unique: true })
  await database.collection('users').createIndex({ resetToken: 1 }, { sparse: true })
  await database.collection('orders').createIndex({ userId: 1, createdAt: -1 })
  await database.collection('projects').createIndex({ ownerId: 1, updatedAt: -1 })
  await database.collection('projects').createIndex({ 'members.userId': 1, updatedAt: -1 })
  await database.collection('projects').createIndex({ shareToken: 1 }, { sparse: true, unique: true })
  await database.collection('notes').createIndex({ projectId: 1, updatedAt: -1 })
  await database.collection('attachments').createIndex({ projectId: 1, createdAt: -1 })
}
