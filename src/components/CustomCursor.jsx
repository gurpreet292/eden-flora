import { useEffect, useState } from 'react'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [label, setLabel] = useState('')

  useEffect(() => {
    const move = (event) => setPosition({ x: event.clientX, y: event.clientY })
    const over = (event) => setLabel(event.target.closest('[data-cursor-label]')?.dataset.cursorLabel || '')
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over) }
  }, [])

  return <div aria-hidden="true" className={`custom-cursor pointer-events-none fixed left-0 top-0 z-100 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-fern/60 bg-ivory/70 transition-[width,height,background-color,border-color] duration-200 lg:block ${label ? 'custom-cursor-active' : ''}`} style={{ left: position.x, top: position.y }}><span className="sr-only">{label}</span>{label && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.12em] text-forest">{label}</span>}</div>
}

export default CustomCursor
