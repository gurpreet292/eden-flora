import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'

const MagneticButton = ({ children, href = '#', className = '' }) => {
  const buttonRef = useRef(null)

  const handleMove = (event) => {
    const bounds = buttonRef.current?.getBoundingClientRect()
    if (!bounds) return
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.18
    buttonRef.current.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`
  }

  const reset = () => { if (buttonRef.current) buttonRef.current.style.transform = '' }

  return <a ref={buttonRef} href={href} onMouseMove={handleMove} onMouseLeave={reset} style={{ color: '#f8f6ee' }} className={`group inline-flex items-center gap-4 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-ivory shadow-[0_10px_24px_rgba(27,58,42,0.16)] transition-[transform,background-color,box-shadow] duration-300 hover:bg-fern hover:shadow-[0_14px_30px_rgba(27,58,42,0.25)] ${className}`}>
    {children}
    <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </a>
}

export default MagneticButton
