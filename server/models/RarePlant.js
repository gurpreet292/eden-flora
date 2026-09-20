export const rarePlantFields = [
  'name', 'scientificName', 'origin', 'rarityLevel', 'conservationStatus',
  'habitat', 'description', 'funFact', 'passportId', 'image', 'discoveryYear',
]

export const createRarePlantDocument = (plant) => ({
  ...plant,
  createdAt: new Date(),
  updatedAt: new Date(),
})
