import { MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import world from '@svg-maps/world'

const regions = [
  { id: 'brazil', label: 'Brazil', x: 34, y: 68, plant: 'Philodendron Spiritus Sancti' },
  { id: 'south-america', label: 'South America', x: 29, y: 78, plant: 'Monstera Obliqua' },
  { id: 'florida-cuba', label: 'Florida / Cuba', x: 22, y: 43, plant: 'Ghost Orchid' },
  { id: 'china', label: 'China', x: 72, y: 39, plant: 'Middlemist Red' },
  { id: 'namibia', label: 'Namibia', x: 53, y: 70, plant: 'Welwitschia mirabilis' },
]

const VaultMap = ({ onSelect, selectedId, plants }) => <div className="vault-map" role="img" aria-label="Interactive map showing rare plant origins">
  <svg className="vault-map__svg" viewBox={world.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g className="map-countries">{world.locations.map((location) => <path key={location.id} d={location.path} aria-label={location.name} />)}</g>
    <path className="map-line" d="M30 95H980M45 230H965M65 370H945M85 510H925" />
    <path className="map-travel-line" d="M343 453 Q 515 320 727 266 M293 559 Q 414 525 535 506 M222 286 Q 278 370 343 453" />
  </svg>
  {regions.map((region) => { const plant = plants?.find((item) => item.name === region.plant); return <motion.button type="button" key={region.id} className={`map-pin ${selectedId === region.id ? 'is-selected' : ''}`} style={{ left: `${region.x}%`, top: `${region.y}%` }} onClick={() => onSelect(region)} aria-label={`Open passport for ${region.plant}`} whileHover={{ scale: 1.08 }}><MapPin size={18} /><span>{region.label}</span><span className="map-pin__popup">{plant?.image && <img src={plant.image} alt="" />}<span className="map-pin__popup-copy"><strong>{plant?.name || region.plant}</strong><small>{region.label} / {plant?.rarityLevel || 'Rare'}<br />Click to open passport</small></span></span></motion.button> })}
  <div className="vault-map__caption"><span className="map-legend-dot" /> Living records across five regions</div>
</div>

export default VaultMap
