import { motion } from 'framer-motion'

const levels = { Rare: 42, 'Near threatened': 42, 'Cultivated heirloom': 38, 'Cultivated rarity': 52, 'Vulnerable': 66, 'Ultra Rare': 82, 'Extremely Rare': 91, Legendary: 98, 'Critically rare': 98, 'Critically endangered': 98 }

const RarityMeter = ({ level, compact = false }) => {
  const value = levels[level] || 50
  return <div className={compact ? 'rarity-meter rarity-meter-compact' : 'rarity-meter'}>
    <div className="rarity-meter__label"><span>Rarity index</span><strong>{level}</strong></div>
    <div className="rarity-meter__track"><motion.span initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }} /></div>
  </div>
}

export default RarityMeter
