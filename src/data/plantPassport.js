const passportRecords = {
  'monstera-deliciosa': {
    plantId: 'EF-24091',
    species: 'Monstera deliciosa',
    purchaseDate: '2024-03-18',
    origin: 'Costa Rica greenhouse',
    light: 78,
    water: 64,
    humidity: 72,
    health: 94,
    milestones: [
      { date: '18 Mar 2024', title: 'Purchased', detail: 'Welcomed home from the Eden greenhouse.', icon: 'sprout' },
      { date: '24 Mar 2024', title: 'First Watering', detail: 'Settled into its new bright, indirect corner.', icon: 'droplets' },
      { date: '06 Jun 2024', title: 'New Leaf', detail: 'The first unfurling leaf marked a happy beginning.', icon: 'leaf' },
      { date: '18 Mar 2025', title: 'Repotted', detail: 'Moved into a larger clay home for another year of growth.', icon: 'package' },
      { date: 'Coming soon', title: 'Flowered', detail: 'A future chapter waiting to be written.', icon: 'sparkles', future: true },
    ],
    memories: [
      { date: '06 Jun 2024', caption: 'First New Leaf', image: 'photo-1614594975525-e45190c55d0b' },
      { date: '18 Mar 2025', caption: 'A New Home', image: 'photo-1497250681960-ef046c08a56e' },
      { date: '02 Aug 2025', caption: 'Morning Light', image: 'photo-1593691509543-c55fb32e5cee' },
    ],
    history: [
      { type: 'Watered', date: '14 Sep 2026', detail: '450 ml filtered water', icon: 'droplets' },
      { type: 'Fertilized', date: '01 Sep 2026', detail: 'Balanced liquid feed, half strength', icon: 'sparkles' },
      { type: 'Repotted', date: '18 Mar 2025', detail: '18 cm terracotta pot with airy soil', icon: 'package' },
    ],
    upcoming: [
      { label: 'Next watering', date: '16 Sep 2026', countdown: 'Water in 2 days', icon: 'droplets' },
      { label: 'Next fertilizing', date: '01 Oct 2026', countdown: 'Fertilize in 17 days', icon: 'sparkles' },
    ],
  },
}

const fallbackPassport = (product) => ({
  plantId: `EF-${String(product.id.length * 137 + product.price).padStart(5, '0')}`,
  species: product.name,
  purchaseDate: '2025-02-14',
  origin: 'Eden Flora greenhouse',
  light: 70,
  water: 62,
  humidity: 68,
  health: 91,
  milestones: [
    { date: '14 Feb 2025', title: 'Purchased', detail: 'Welcomed home from the Eden greenhouse.', icon: 'sprout' },
    { date: '21 Feb 2025', title: 'First Watering', detail: 'Settled into a considered corner of the home.', icon: 'droplets' },
    { date: 'Coming soon', title: 'New Leaf', detail: 'A future chapter waiting to be written.', icon: 'leaf', future: true },
  ],
  memories: [{ date: '14 Feb 2025', caption: 'The First Day', image: product.imageUrl || `https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=900&q=85` }],
  history: [{ type: 'Watered', date: '14 Sep 2026', detail: product.water, icon: 'droplets' }],
  upcoming: [
    { label: 'Next watering', date: '18 Sep 2026', countdown: 'Water in 4 days', icon: 'droplets' },
    { label: 'Next fertilizing', date: '01 Oct 2026', countdown: 'Fertilize in 17 days', icon: 'sparkles' },
  ],
})

export const getPlantPassport = (product, id) => passportRecords[id] || fallbackPassport(product)

export const calculatePlantAge = (purchaseDate, today = new Date()) => {
  const purchased = new Date(`${purchaseDate}T00:00:00`)
  let years = today.getFullYear() - purchased.getFullYear()
  let months = today.getMonth() - purchased.getMonth()
  if (today.getDate() < purchased.getDate()) months -= 1
  if (months < 0) { years -= 1; months += 12 }
  return { years, months }
}

export const formatPassportDate = (date) => {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00`) : new Date(date)
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed)
}
