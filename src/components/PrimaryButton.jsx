import { ArrowUpRight } from 'lucide-react'

const PrimaryButton = ({ children, href = '#' }) => (
  <a href={href} className="group inline-flex items-center gap-4 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-ivory transition-transform duration-300 hover:-translate-y-0.5 hover:bg-fern">
    {children}
    <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </a>
)

export default PrimaryButton
