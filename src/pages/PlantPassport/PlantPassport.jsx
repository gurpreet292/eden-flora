import { ArrowLeft, Leaf, Sprout } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '../../components/Container'
import PlantPassportCard from '../../components/PlantPassport/PlantPassportCard'
import PlantJourney from '../../components/PlantPassport/PlantJourney'
import CareOverview from '../../components/PlantPassport/CareOverview'
import MemoryGallery from '../../components/PlantPassport/MemoryGallery'
import CareHistory from '../../components/PlantPassport/CareHistory'
import UpcomingCare from '../../components/PlantPassport/UpcomingCare'
import { calculatePlantAge, getPlantPassport } from '../../data/plantPassport'
import { getProduct } from '../../data/products'

const PlantPassport = () => {
  const { productId } = useParams()
  const product = getProduct(productId) || getProduct('monstera-deliciosa')
  const passport = getPlantPassport(product, productId)
  const age = calculatePlantAge(passport.purchaseDate)

  return <div className="relative min-h-screen overflow-hidden bg-ivory text-forest">
    <div className="pointer-events-none absolute left-[-12rem] top-40 size-96 rounded-full bg-sage/80 blur-3xl" />
    <div className="pointer-events-none absolute right-[-10rem] top-[38rem] size-96 rounded-full bg-gold/10 blur-3xl" />
    <div className="pointer-events-none absolute right-[8%] top-28 hidden text-fern/10 lg:block"><Leaf size={160} strokeWidth={0.5} /></div>
    <main className="relative z-10 pb-24 pt-28 sm:pt-36">
      <Container>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap items-center justify-between gap-5">
          <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest/55 transition hover:text-fern"><ArrowLeft size={15} /> Back to the collection</Link>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold"><Sprout size={15} strokeWidth={1.3} /> Living archive / {passport.plantId}</div>
        </motion.div>
        <PlantPassportCard product={product} passport={passport} age={age} />
        <div className="mx-auto mt-20 max-w-6xl space-y-20 sm:mt-28 sm:space-y-28">
          <CareOverview passport={passport} />
          <div className="grid gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20"><PlantJourney milestones={passport.milestones} /><UpcomingCare upcoming={passport.upcoming} /></div>
          <MemoryGallery memories={passport.memories} />
          <CareHistory history={passport.history} />
        </div>
      </Container>
    </main>
  </div>
}

export default PlantPassport
