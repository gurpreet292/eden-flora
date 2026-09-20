import { useEffect, useRef } from 'react'

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const labelRef = useRef(null)
  const frameRef = useRef(null)
  const nextPositionRef = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const move = (event) => {
      nextPositionRef.current = { x: event.clientX, y: event.clientY }
      if (frameRef.current) return

      frameRef.current = requestAnimationFrame(() => {
        const { x, y } = nextPositionRef.current
        cursorRef.current?.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`)
        frameRef.current = null
      })
    }
    const over = (event) => {
      const nextLabel = event.target.closest?.('[data-cursor-label]')?.dataset.cursorLabel || ''
      if (!cursorRef.current || !labelRef.current || labelRef.current.textContent === nextLabel) return
      labelRef.current.textContent = nextLabel
      cursorRef.current.classList.toggle('custom-cursor-active', Boolean(nextLabel))
      labelRef.current.classList.toggle('hidden', !nextLabel)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return <div ref={cursorRef} aria-hidden="true" className="custom-cursor pointer-events-none fixed left-0 top-0 z-[200] hidden size-3 rounded-full border border-fern/60 bg-ivory/70 transition-[width,height,background-color,border-color] duration-200 will-change-transform lg:block" style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}><span ref={labelRef} className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.12em] text-forest" /></div>
}

export default CustomCursor
