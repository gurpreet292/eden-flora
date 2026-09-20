import axios from 'axios'
import { ArrowLeft, CalendarDays, Globe2, Leaf, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '../components/Container'
import RarityMeter from '../components/BotanicalVault/RarityMeter'
import FloatingLeaves from '../components/BotanicalVault/FloatingLeaves'
import PlantQrCode from '../components/BotanicalVault/PlantQrCode'
import AICurator from '../components/BotanicalVault/AICurator'

const PlantPassport = () => {
  const { plantId } = useParams()
  const [plant, setPlant] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`/api/vault/${plantId}`).then((response) => setPlant(response.data)).catch(() => setError('This botanical record could not be found.'))
  }, [plantId])

  if (error) return <main className="passport-page passport-error"><Container><p>{error}</p><Link to="/vault">Return to the Vault</Link></Container></main>
  if (!plant) return <main className="passport-page"><Container><div className="passport-loading">Retrieving botanical certificate...</div></Container></main>

  return <main className="passport-page"><FloatingLeaves /><Container><Link to="/vault" className="passport-back"><ArrowLeft size={16} /> Return to the Vault</Link><motion.section className="passport-sheet" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}><div className="passport-sheet__top"><span>Eden Flora / Botanical Registry</span><strong>{plant.passportId}</strong></div><div className="passport-sheet__hero"><div><p className="vault-kicker">Official living record</p><h1>{plant.name}</h1><p className="vault-scientific">{plant.scientificName}</p><RarityMeter level={plant.rarityLevel} /></div><div><img src={plant.image} alt={plant.name} /><PlantQrCode value={`https://edenflora.com/vault/${plant.id}`} /></div></div><div className="passport-facts"><div><Globe2 size={18} /><span>Origin<strong>{plant.origin}</strong></span></div><div><CalendarDays size={18} /><span>Plant birthday<strong>{plant.birthday}</strong></span></div><div><ShieldCheck size={18} /><span>Conservation<strong>{plant.conservationStatus}</strong></span></div><div><Leaf size={18} /><span>Habitat<strong>{plant.habitat}</strong></span></div></div><div className="passport-body"><div><p className="vault-kicker">The conservation note</p><h2>A record worth<br /><i>keeping alive.</i></h2></div><div><p>{plant.description}</p><p><strong>Why it became rare.</strong> {plant.whyRare}</p><p><strong>Why protecting it matters.</strong> {plant.whyProtect}</p></div></div><div className="passport-timeline"><p className="vault-kicker">Discovery history</p><div className="timeline-line"><div><span>{plant.discoveryYear || '—'}</span><p>First recorded</p></div><div><span>Today</span><p>In the Vault</p></div><div><span>Next</span><p>Protected future</p></div></div></div><div className="passport-note"><p className="vault-kicker">Collector&apos;s note</p><blockquote>“{plant.story}”</blockquote><p className="passport-fact"><strong>Field note:</strong> {plant.funFact}</p></div><AICurator plant={plant} /><div className="passport-seal">EF <span>✦</span> 2026</div></motion.section></Container></main>
}

export default PlantPassport
