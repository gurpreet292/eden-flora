import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Restores the top of the page after an in-app route change. */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default ScrollToTop
