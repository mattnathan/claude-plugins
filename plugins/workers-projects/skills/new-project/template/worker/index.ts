import { Hono } from 'hono'

const app = new Hono<{ Bindings: Env }>()

app.get('/api/hello', (c) => c.json({ message: 'Hello from __NAME__' }))

export default app
