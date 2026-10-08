import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test from 'node:test'

process.env.VERCEL = '1'
process.env.CLIENT_ORIGIN = 'http://127.0.0.1'

const { default: app } = await import('../server/index.js')

const startServer = () => new Promise((resolve) => {
  const server = createServer(app)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    resolve({ server, url: `http://127.0.0.1:${port}` })
  })
})

test('exposes the Eden Flora API identity endpoint', async (t) => {
  const { server, url } = await startServer()
  t.after(() => server.close())

  const response = await fetch(url, { headers: { Origin: process.env.CLIENT_ORIGIN } })
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.name, 'Eden Flora API')
  assert.equal(payload.status, 'running')
  assert.ok(payload.endpoints.includes('/api/health'))
})
