import { Leaf } from 'lucide-react'

const LuxuryDivider = () => (
  <div className="mx-auto flex w-full max-w-xs items-center gap-4 pt-24 text-gold sm:pt-32" aria-hidden="true">
    <span className="h-px flex-1 bg-gold/45" />
    <Leaf size={14} strokeWidth={1.2} />
    <span className="h-px flex-1 bg-gold/45" />
  </div>
)

export default LuxuryDivider
