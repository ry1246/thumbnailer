import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { ensureStorageDirs } from './lib/storage.js'
import { uploadRoute } from './routes/upload.js'
import { jobsRoute } from './routes/jobs.js'
import { thumbnailsRoute } from './routes/thumbnails.js'
import { cors } from 'hono/cors'

await ensureStorageDirs()

const app = new Hono()
app.get('/', (c) => c.text('Hello Hono!'))
app.route('/', uploadRoute)
app.route('/', jobsRoute)
app.route('/', thumbnailsRoute)

app.use('/upload', cors())
app.use('/jobs/*', cors())
app.use('/thumbnails/*', cors())

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
