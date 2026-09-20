import { Router } from 'express'
import { getDatabase } from '../db.js'
import { starterProducts } from '../data/products.js'

const router = Router()

const productsCollection = async () => {
  const database = await getDatabase()
  const collection = database.collection('products')
  const count = await collection.countDocuments()

  if (count === 0) {
    await collection.insertMany(starterProducts.map((product) => ({ ...product, createdAt: new Date(), updatedAt: new Date() })))
  }

  return collection
}

router.get('/', async (request, response, next) => {
  try {
    const collection = await productsCollection()
    const products = await collection.find({}).sort({ name: 1 }).toArray()
    response.json(products)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (request, response, next) => {
  try {
    const collection = await productsCollection()
    const product = await collection.findOne({ id: request.params.id })

    if (!product) {
      return response.status(404).json({ message: 'Product not found' })
    }

    response.json(product)
  } catch (error) {
    next(error)
  }
})

export default router
