import { motion } from 'framer-motion'

const leaves = [
  { left: '8%', top: '18%', rotate: 22, delay: 0 },
  { left: '84%', top: '25%', rotate: -32, delay: 1.8 },
  { left: '72%', top: '72%', rotate: 54, delay: 3.2 },
  { left: '18%', top: '78%', rotate: -15, delay: 2.4 },
]

const FloatingLeaves = () => <div className="vault-leaves" aria-hidden="true">
  {leaves.map((leaf, index) => <motion.span key={index} className="vault-leaf" style={{ left: leaf.left, top: leaf.top, rotate: leaf.rotate }} animate={{ y: [0, -16, 0], rotate: [leaf.rotate, leaf.rotate + 10, leaf.rotate] }} transition={{ duration: 6 + index, repeat: Infinity, delay: leaf.delay, ease: 'easeInOut' }} />)}
</div>

export default FloatingLeaves
