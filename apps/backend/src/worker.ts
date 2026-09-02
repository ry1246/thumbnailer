import { Worker } from 'bullmq'
import path from 'node:path'
import sharp from 'sharp'
import { connection } from './lib/redis.js'
import { THUMBNAIL_DIR } from './lib/storage.js'
import type { ThumbnailJobData } from './queue.js'

const worker = new Worker<ThumbnailJobData>(
  'thumbnail',
  async (job) => {
    const { filePath, fileName } = job.data
    const thumbnailPath = path.join(THUMBNAIL_DIR, fileName)

    await sharp(filePath)
      .resize(200, 200, { fit: 'cover' })
      .toFile(thumbnailPath)

    return { thumbnailUrl: `/thumbnails/${fileName}` }
  },
  { connection }
)

worker.on('completed', (job) => {
  console.log(`job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`job ${job?.id} failed`, err)
})
