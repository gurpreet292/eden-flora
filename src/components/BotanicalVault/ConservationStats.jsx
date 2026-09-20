import { motion } from 'framer-motion'

const ConservationStats = ({ plants }) => {
  const endangered = plants.filter((plant) => /endangered|threatened|vulnerable|rare/i.test(plant.conservationStatus)).length
  const regions = new Set(plants.map((plant) => plant.origin)).size
  const flowers = plants.filter((plant) => plant.category === 'Flower').length
  const stats = [
    ['08', 'Living records'],
    [String(regions).padStart(2, '0'), 'Regions represented'],
    [String(endangered).padStart(2, '0'), 'At-risk species'],
    [String(flowers).padStart(2, '0'), 'Flowering specimens'],
  ]
  return <div className="vault-stats" aria-label="Vault conservation statistics">{stats.map(([value, label], index) => <motion.div key={label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }}><strong>{value}</strong><span>{label}</span></motion.div>)}</div>
}

export default ConservationStats
