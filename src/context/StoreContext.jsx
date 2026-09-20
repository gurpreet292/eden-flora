import { useEffect, useMemo, useState } from 'react'
import { StoreContext } from './store'

const readCart = () => {
  try { return JSON.parse(localStorage.getItem('eden-flora-cart')) || [] } catch { return [] }
}

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(readCart)

  useEffect(() => { localStorage.setItem('eden-flora-cart', JSON.stringify(cart)) }, [cart])

  const addToCart = (product, quantity = 1) => setCart((items) => {
    const existing = items.find((item) => item.id === product.id)
    return existing ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) : [...items, { ...product, quantity }]
  })
  const updateQuantity = (id, quantity) => setCart((items) => quantity < 1 ? items.filter((item) => item.id !== id) : items.map((item) => item.id === id ? { ...item, quantity } : item))
  const removeFromCart = (id) => setCart((items) => items.filter((item) => item.id !== id))
  const clearCart = () => setCart([])
  const value = useMemo(() => ({ cart, addToCart, updateQuantity, removeFromCart, clearCart, itemCount: cart.reduce((total, item) => total + item.quantity, 0), subtotal: cart.reduce((total, item) => total + item.price * item.quantity, 0) }), [cart])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

