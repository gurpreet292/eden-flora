import { ArrowRight } from 'lucide-react'

const SecondaryButton = ({ children, href = '#' }) => (
  <a href={href} className="group inline-flex items-center gap-3 border-b border-fern/50 pb-2 text-sm font-medium text-fern transition-colors hover:border-forest hover:text-forest">
    {children}
    <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
  </a>
)

export default SecondaryButton
