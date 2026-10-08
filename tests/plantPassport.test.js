import assert from 'node:assert/strict'
import test from 'node:test'
import { calculatePlantAge, formatPassportDate, getPlantPassport } from '../src/data/plantPassport.js'

const monstera = { id: 'monstera-deliciosa', name: 'Monstera Deliciosa', price: 68 }
const stringOfPearls = { id: 'string-of-pearls', name: 'String of Pearls', price: 36, water: 'Every 14 days' }

test('calculates plant age before and on an anniversary', () => {
  assert.deepEqual(calculatePlantAge('2024-09-18', new Date('2026-09-17T00:00:00')), { years: 1, months: 11 })
  assert.deepEqual(calculatePlantAge('2024-09-18', new Date('2026-09-18T00:00:00')), { years: 2, months: 0 })
})

test('formats ISO passport dates for display', () => {
  assert.equal(formatPassportDate('2026-09-16'), 'Sep 16, 2026')
  assert.equal(formatPassportDate('not-a-date'), 'not-a-date')
})

test('returns a stored passport record when one exists', () => {
  const passport = getPlantPassport(monstera, 'monstera-deliciosa')

  assert.equal(passport.plantId, 'EF-24091')
  assert.equal(passport.species, 'Monstera deliciosa')
  assert.equal(passport.milestones.length, 5)
})

test('creates a complete fallback passport for another product', () => {
  const passport = getPlantPassport(stringOfPearls, stringOfPearls.id)

  assert.match(passport.plantId, /^EF-\d{5}$/)
  assert.equal(passport.species, stringOfPearls.name)
  assert.equal(passport.upcoming.length, 2)
  assert.equal(passport.history[0].detail, stringOfPearls.water)
})
