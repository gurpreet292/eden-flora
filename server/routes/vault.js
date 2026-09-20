import { Router } from 'express'
import { createVaultPlant, curateVaultPlant, getVaultPlant, listVaultPlants } from '../controllers/vaultController.js'

const router = Router()

router.get('/', listVaultPlants)
router.get('/:id', getVaultPlant)
router.post('/:id/curate', curateVaultPlant)
router.post('/', createVaultPlant)

export default router
