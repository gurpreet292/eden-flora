import { motion } from 'framer-motion'

const leaves = [
  { className: 'left-[9%] top-[28%] hidden sm:block', delay: 0.2, duration: 11, rotation: -28, scale: 0.8 },
  { className: 'right-[8%] top-[18%]', delay: 1.8, duration: 14, rotation: 24, scale: 0.65 },
  { className: 'bottom-[16%] left-[46%] hidden sm:block', delay: 3.4, duration: 13, rotation: -12, scale: 0.55 },
  { className: 'bottom-[24%] right-[17%]', delay: 4.6, duration: 16, rotation: 42, scale: 0.45 },
]

const FloatingLeaves = ({ parallaxX }) => (
  <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
    {leaves.map((leaf, index) => (
      <motion.div
        key={index}
        className={`absolute ${leaf.className}`}
        style={{ x: parallaxX }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: [0.2, 0.45, 0.2], y: [8, -20, 8], rotate: [leaf.rotation, leaf.rotation + 8, leaf.rotation] }}
        transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="block h-11 w-5 rounded-[100%_0_100%_0] border border-fern/30 bg-fern/10 shadow-[0_0_18px_rgba(47,93,58,0.08)]" style={{ transform: `scale(${leaf.scale})` }} />
      </motion.div>
    ))}
  </div>
)

export default FloatingLeaves
