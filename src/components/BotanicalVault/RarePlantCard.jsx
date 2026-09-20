import { ArrowUpRight, MapPin, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import RarityMeter from './RarityMeter'

const countryFlags = { China: '🇨🇳', Brazil: '🇧🇷', Namibia: '🇳🇦', 'United Kingdom': '🇬🇧', 'Florida / Cuba': '🇺🇸', 'South America': '🌎', 'Central America': '🌎', 'Southeast Asia': '🌏' }

const RarePlantCard = ({ plant, onPassport, onPreview, isRevealed, onReveal }) => {
  const toggleCard = () => onReveal(plant.id)
  const handleKeyDown = (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleCard() } }
  return <motion.article className={`vault-card ${isRevealed ? 'is-flipped' : ''}`} layout initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }} whileHover={{ y: -8 }} onClick={(event) => { if (!event.target.closest('button')) toggleCard() }} onKeyDown={handleKeyDown} tabIndex="0" aria-label={`${plant.name} collectible card. Press enter to flip.`}>
    <div className="vault-card__inner">
      <div className="vault-card__face vault-card__front"><div className="vault-card__image-wrap"><img src={plant.image} alt={plant.name} className="vault-card__image" /><span className="vault-card__index">{plant.passportId}</span><span className="vault-card__badge">{plant.rarityLevel}</span></div><div className="vault-card__body"><p className="vault-kicker"><MapPin size={12} /> {plant.origin}</p><h3>{plant.name}</h3><p className="vault-scientific">{plant.scientificName}</p><div className="vault-card__status-row"><span className="vault-flag" aria-label={`Origin: ${plant.origin}`}>{countryFlags[plant.origin] || '🌿'}</span><span>{plant.conservationStatus}</span></div><button type="button" className="vault-text-button" onClick={() => onPreview(plant)}>View Passport <ArrowUpRight size={15} /></button></div></div>
      <div className="vault-card__face vault-card__back"><div className="vault-card__back-head"><span>{plant.passportId}</span><RotateCcw size={16} /></div><p className="vault-kicker">Archive story</p><h3>{plant.name}</h3><p className="vault-card__story">{plant.story}</p><div className="vault-card__history"><span>Discovery<strong>{plant.discoveryYear || 'Unknown'}</strong></span><span>Explorer<strong>{plant.explorer || 'Eden Flora Field Archive'}</strong></span><span>Habitat<strong>{plant.habitat}</strong></span><span>Why rare<strong>{plant.whyRare}</strong></span></div><RarityMeter level={plant.rarityLevel} compact /><button type="button" className="vault-text-button" onClick={() => onPassport(plant)}>Open full passport <ArrowUpRight size={15} /></button></div>
    </div>
  </motion.article>
}

export default RarePlantCard
