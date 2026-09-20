import { Router } from 'express'
import { getDatabase } from '../db.js'
import { requireAuth } from './auth.js'
import { starterProducts } from '../data/products.js'

const router = Router()

router.get('/', requireAuth, async (request, response, next) => {
  try {
    const database = await getDatabase()
    const orders = await database.collection('orders')
      .find({ userId: request.user.id })
      .sort({ createdAt: -1 })
      .toArray()
    response.json({ orders })
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAuth, async (request, response, next) => {
  try {
    const { items } = request.body

    if (!Array.isArray(items) || items.length === 0) {
      return response.status(400).json({ message: 'At least one item is required' })
    }

    const pricedItems = items.map((item) => {
      const product = starterProducts.find((candidate) => candidate.id === item.id)
      const quantity = Number(item.quantity)
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return null
      return { id: product.id, name: product.name, price: product.price, quantity }
    })

    if (pricedItems.some((item) => !item)) return response.status(400).json({ message: 'One or more items are invalid.' })

    const database = await getDatabase()
    const subtotal = pricedItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const order = {
      userId: request.user.id,
      customer: { name: request.user.name, email: request.user.email },
      items: pricedItems,
      subtotal,
      total: subtotal,
      currency: 'USD',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await database.collection('orders').insertOne(order)

    response.status(201).json({ ...order, _id: result.insertedId })
  } catch (error) {
    next(error)
  }
})

export default router
