import axios from 'axios'
import { ArrowUpRight, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Container from '../components/Container'
import FloatingLeaves from '../components/BotanicalVault/FloatingLeaves'
import RarePlantCard from '../components/BotanicalVault/RarePlantCard'
import VaultMap from '../components/BotanicalVault/VaultMap'
import ConservationStats from '../components/BotanicalVault/ConservationStats'
import PlantPassportPreview from '../components/BotanicalVault/PlantPassportPreview'

const filters = [
  ['origin', 'Country'],
  ['conservationStatus', 'Conservation'],
  ['rarityLevel', 'Rarity'],
  ['environment', 'Setting'],
  ['category', 'Form'],
]

const BotanicalVault = () => {
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revealedId, setRevealedId] = useState(null)
  const [previewPlant, setPreviewPlant] = useState(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 700], [0, 150])

  const loadPlants = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/vault')
      setPlants(response.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'The archive is temporarily resting. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPlants() }, [])

  const options = useMemo(() => Object.fromEntries(filters.map(([key]) => [key, [...new Set(plants.map((plant) => plant[key]))]])), [plants])
  const visiblePlants = plants.filter((plant) => {
    const searchable = `${plant.name} ${plant.scientificName} ${plant.origin} ${plant.description}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && filters.every(([key]) => !activeFilters[key] || plant[key] === activeFilters[key])
  })

  const selectRegion = (region) => {
    setSelectedRegion(region.id)
    const plant = plants.find((item) => item.name === region.plant)
    if (plant) navigate(`/vault/${plant.id}`)
  }

  const discoverSpecies = () => {
    if (!plants.length) return
    const plant = plants[Math.floor(Math.random() * plants.length)]
    setRevealedId(plant.id)
    setQuery('')
    setActiveFilters({})
    document.getElementById(`plant-${plant.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return <div className="vault-page">
    <section className="vault-hero"><motion.div className="vault-hero__parallax" style={{ y: heroY }}><FloatingLeaves /></motion.div><Container className="vault-hero__inner"><motion.p className="vault-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}><Sparkles size={13} /> Eden Flora / Living archive</motion.p><motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>The Botanical <em>Vault</em></motion.h1><motion.p className="vault-hero__copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>A quiet collection of the world&apos;s rarest and most extraordinary plants, preserved to deepen wonder and promote botanical conservation.</motion.p><div className="vault-hero__rule" /></Container></section>
    <main>
      <section className="vault-intro"><Container className="vault-intro__grid"><div><p className="vault-kicker">01 / The atlas</p><h2>Where rarity<br /><i>takes root.</i></h2></div><div><p className="vault-lede">Every entry in the Vault is a living story. Explore the places these plants call home, then meet the specimens whose survival depends on our attention.</p><p className="vault-muted">Hover to inspect. Click a pin to open its passport.</p></div></Container><Container><VaultMap onSelect={selectRegion} selectedId={selectedRegion} plants={plants} /></Container></section>
      <section className="vault-collection"><Container><div className="vault-section-heading"><div><p className="vault-kicker">02 / The collection</p><h2>Rare by nature.</h2></div><div className="vault-heading-actions"><p className="vault-muted">{visiblePlants.length} living records / curated edition</p><button type="button" className="vault-discover" onClick={discoverSpecies}>Discover a hidden species <ArrowUpRight size={15} /></button></div></div>{!loading && !error && <ConservationStats plants={plants} />}<div className="vault-controls"><label className="vault-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive" aria-label="Search the archive" /></label><div className="vault-filters"><SlidersHorizontal size={16} />{filters.map(([key, label]) => <label key={key}><span className="sr-only">Filter by {label}</span><select value={activeFilters[key] || ''} onChange={(event) => setActiveFilters((current) => ({ ...current, [key]: event.target.value }))}><option value="">{label}</option>{(options[key] || []).map((option) => <option key={option} value={option}>{option}</option>)}</select></label>)}</div></div>{loading && <div className="vault-grid">{[1, 2, 3].map((item) => <div className="vault-skeleton" key={item} />)}</div>}{error && <div className="vault-error"><p>{error}</p><button type="button" onClick={loadPlants}>Retry archive</button></div>}{!loading && !error && visiblePlants.length === 0 && <div className="vault-empty">No records match this search.</div>}{!loading && !error && <div className="vault-grid">{visiblePlants.map((plant) => <div id={`plant-${plant.id}`} key={plant.id}><RarePlantCard plant={plant} isRevealed={revealedId === plant.id} onReveal={setRevealedId} onPreview={setPreviewPlant} onPassport={(item) => navigate(`/vault/${item.id}`)} /></div>)}</div>}</Container></section>
      <section className="vault-pledge"><Container><p className="vault-kicker">03 / A living promise</p><h2>Wonder is the<br /><i>first act of care.</i></h2><p>When we learn a plant&apos;s story, we make room for the habitat that holds it. The Vault is an invitation to collect knowledge, not specimens.</p></Container></section>
    </main>
    <AnimatePresence>{previewPlant && <PlantPassportPreview plant={previewPlant} onClose={() => setPreviewPlant(null)} onOpen={(plant) => navigate(`/vault/${plant.id}`)} />}</AnimatePresence>
  </div>
}

export default BotanicalVault
