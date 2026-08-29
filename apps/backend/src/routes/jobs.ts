import { Hono } from 'hono'
import { thumbnailQueue } from '../queue.js'

export const jobsRoute = new Hono()

jobsRoute.get('/jobs/:id', async (c) => {
  const job = await thumbnailQueue.getJob(c.req.param('id'))
  if (!job) return c.json({ error: 'job not found' }, 404)

  const state = await job.getState()
  return c.json({
    id: job.id,
    state,
    result: job.returnvalue,
    faileReason: job.failedReason,
  })
})
