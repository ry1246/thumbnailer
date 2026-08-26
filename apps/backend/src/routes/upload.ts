import { Hono } from "hono"
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { UPLOAD_DIR } from '../lib/storage.js'
import { thumbnailQueue } from '../queue.js'

export const uploadRoute = new Hono()

uploadRoute.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file']

  if (!(file instanceof File)) {
    return c.json({ error: 'file is required' }, 400)
  }

  const fileName = `${randomUUID()}${path.extname(file.name)}`
  const filePath = path.join(UPLOAD_DIR, fileName)
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()))

  const job = await thumbnailQueue.add('generate', { filePath, fileName })

  return c.json({ jobId: job.id }, 202)
})
