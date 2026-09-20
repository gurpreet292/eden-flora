import { Droplets, Leaf, Package, Sparkles, Sprout } from 'lucide-react'

const icons = { droplets: Droplets, leaf: Leaf, package: Package, sparkles: Sparkles, sprout: Sprout }

const PassportIcon = ({ name, size = 18, strokeWidth = 1.5 }) => {
  const Icon = icons[name] || Leaf
  return <Icon size={size} strokeWidth={strokeWidth} />
}

export default PassportIcon
