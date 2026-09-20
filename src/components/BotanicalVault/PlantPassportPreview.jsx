import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import PlantQrCode from './PlantQrCode'
import RarityMeter from './RarityMeter'

const PlantPassportPreview = ({ plant, onClose, onOpen }) => <motion.div className="passport-preview-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
  <motion.section className="passport-preview" role="dialog" aria-modal="true" aria-labelledby="passport-preview-title" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14 }} onClick={(event) => event.stopPropagation()}>
    <button type="button" className="passport-preview__close" onClick={onClose} aria-label="Close passport preview"><X size={18} /></button>
    <div className="passport-preview__image"><img src={plant.image} alt={plant.name} /><span>{plant.passportId}</span></div>
    <div className="passport-preview__content"><p className="vault-kicker">Botanical passport preview</p><h2 id="passport-preview-title">{plant.name}</h2><p className="vault-scientific">{plant.scientificName}</p><div className="passport-preview__facts"><span>Origin<strong>{plant.origin}</strong></span><span>Discovery<strong>{plant.discoveryYear || 'Undocumented'}</strong></span><span>Status<strong>{plant.conservationStatus}</strong></span></div><RarityMeter level={plant.rarityLevel} /><p className="passport-preview__note">{plant.story}</p><div className="passport-preview__footer"><PlantQrCode value={`https://edenflora.com/vault/${plant.id}`} /><button type="button" className="vault-text-button" onClick={() => onOpen(plant)}>Open full passport</button></div></div>
  </motion.section>
</motion.div>

export default PlantPassportPreview
